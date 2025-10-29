import { 
  Address, 
  Contract, 
  Networks, 
  TransactionBuilder, 
  BASE_FEE, 
  scValToNative, 
  nativeToScVal,
  rpc, 
  xdr 
} from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = 'CAOWRWB4T3RP7N2TFLBLAMIG2IREJHP62T5LK7YXBNP3AXXYAPSB7KHF';

// Initialize RPC client
const server = new rpc.Server(RPC_URL);

// Initialize contract
const contract = new Contract(CONTRACT_ID);

/**
 * Helper to convert JS arguments to Stellar ScVal format
 */
const convertArgsToScVal = (args) => {
  return args.map(arg => {
    // Check if it's already an ScVal (pre-converted) - has _attributes property
    if (arg && typeof arg === 'object' && '_attributes' in arg) {
      return arg; // Already an ScVal, pass through
    }
    
    // Check if it's a Stellar address (starts with G and is 56 characters)
    if (typeof arg === 'string' && arg.startsWith('G') && arg.length === 56) {
      return new Address(arg).toScVal();
    }
    
    // For strings, check if it's an enum variant
    if (typeof arg === 'string') {
      // Check if it's a VoteType enum variant (InFavor or AGAINST)
      if (arg === 'InFavor' || arg === 'AGAINST') {
        // Encode as Vec([Symbol]) for enum
        return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(arg)]);
      }
      // Otherwise, it's a regular string
      return xdr.ScVal.scvString(arg);
    }
    
    // For numbers
    if (typeof arg === 'number') {
      return nativeToScVal(arg, { type: 'u32' });
    }
    
    // For booleans
    if (typeof arg === 'boolean') {
      return nativeToScVal(arg, { type: 'bool' });
    }
    
    // Default fallback
    return nativeToScVal(arg);
  });
};

/**
 * Call a read-only contract method (simulation only, no signing required)
 * @param {string} methodName - The contract method name
 * @param {Array} args - Arguments for the method
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<any>} The result from the contract
 */
export const callContractMethod = async (methodName, args = [], userAddress) => {
  try {
    // Convert arguments to Stellar contract values
    const contractArgs = convertArgsToScVal(args);
    
    // Create the contract call operation
    const operation = contract.call(methodName, ...contractArgs);
    
    // Get account to build transaction
    const account = await server.getAccount(userAddress);
    
    // Build a temporary transaction for simulation
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();
    
    // Simulate the transaction to get the result
    const simulation = await server.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }
    
    // Convert result back to native JavaScript value
    if (simulation.result?.retval) {
      const result = scValToNative(simulation.result.retval);
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Error calling contract method:', error);
    throw error;
  }
};

/**
 * Invoke a contract method that requires signing (write operations)
 * @param {string} methodName - The contract method name
 * @param {Array} args - Arguments for the method
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<object>} Transaction result with status and hash
 */
export const invokeContractMethod = async (methodName, args = [], userAddress) => {
  try {
    // Convert arguments to Stellar contract values
    const contractArgs = convertArgsToScVal(args);
    
    // Create the contract call operation
    const operation = contract.call(methodName, ...contractArgs);
    
    // Get account info
    const account = await server.getAccount(userAddress);
    
    // Build transaction with proper fee
    const builtTransaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate transaction first
    const simulation = await server.simulateTransaction(builtTransaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Prepare transaction with simulation results
    const preparedTransaction = rpc.assembleTransaction(
      builtTransaction,
      simulation
    );

    // Build the final transaction
    const finalTransaction = preparedTransaction.build();
    
    // Convert to XDR for signing
    const transactionXDR = finalTransaction.toXDR();

    // Sign with Freighter
    const signedResult = await signTransaction(transactionXDR, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Extract the signed XDR from the result
    const signedXDR = typeof signedResult === 'string' ? signedResult : signedResult.signedTxXdr;

    // Parse the signed transaction
    const signedTransaction = TransactionBuilder.fromXDR(
      signedXDR,
      NETWORK_PASSPHRASE
    );

    // Submit transaction
    const sendResponse = await server.sendTransaction(signedTransaction);
    
    if (sendResponse.status === 'ERROR') {
      throw new Error('Send failed: ' + JSON.stringify(sendResponse, null, 2));
    }
    
    // Wait for transaction to be confirmed (poll JSON-RPC getTransaction)
    if (sendResponse.status === 'PENDING') {
      const makeGetTxReq = async () => {
        const requestBody = {
          jsonrpc: '2.0',
          id: 8675309,
          method: 'getTransaction',
          params: { hash: sendResponse.hash }
        };
        const res = await fetch(RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        const json = await res.json();
        return json.result;
      };

      let getResponse = await makeGetTxReq();
      
      // Poll for transaction status
      while (getResponse.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await makeGetTxReq();
      }
      
      if (getResponse.status === 'SUCCESS') {
        return {
          status: 'SUCCESS',
          hash: sendResponse.hash,
          result: null  // Avoid parsing complex return types
        };
      } else {
        throw new Error(`Transaction failed: ${getResponse.status}`);
      }
    }
    
    return {
      status: sendResponse.status,
      hash: sendResponse.hash
    };
    
  } catch (error) {
    console.error('Error invoking contract method:', error);
    throw error;
  }
};