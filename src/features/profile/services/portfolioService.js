import { supabase } from '../../../lib/supabaseClient'

/**
 * Result helpers
 */
const ok = (data) => ({ ok: true, data })
const fail = (error) => ({ 
  ok: false, 
  error: { 
    code: error?.code || 'UNKNOWN', 
    message: error?.message || String(error) 
  } 
})

/**
 * Column definitions
 */
const ENTRY_COLUMNS = `
  id, profile_id, title, description, created_at,
  portfolio_files ( id, entry_id, storage_path, mime_type, uploaded_at )
`

/**
 * Get all portfolio entries for a profile
 * Any authenticated user can read any portfolio (public read)
 * @param {string} profileId - Profile UUID
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export const getMyPortfolio = async (profileId) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_entries')
      .select(ENTRY_COLUMNS)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })

    if (error) return fail(error)
    return ok(data || [])
  } catch (e) {
    return fail(e)
  }
}

/**
 * Create a new portfolio entry
 * @param {Object} params
 * @param {string} params.profileId - Profile UUID
 * @param {string} params.title - Project title
 * @param {string} params.description - Project description
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const createPortfolioEntry = async ({ profileId, title, description }) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_entries')
      .insert([{ 
        profile_id: profileId, 
        title, 
        description 
      }])
      .select('id, profile_id, title, description, created_at')
      .single()

    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Update a portfolio entry
 * @param {Object} params
 * @param {number} params.entryId - Entry ID
 * @param {string} params.title - Updated title
 * @param {string} params.description - Updated description
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const updatePortfolioEntry = async ({ entryId, title, description }) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_entries')
      .update({ title, description })
      .eq('id', entryId)
      .select('id, profile_id, title, description, created_at')
      .single()

    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Upload a file to a portfolio entry
 * Bucket name: 'portfolios' (plural)
 * @param {Object} params
 * @param {string} params.profileId - Profile UUID
 * @param {number} params.entryId - Entry ID
 * @param {File} params.file - File to upload
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const uploadPortfolioFile = async ({ profileId, entryId, file }) => {
  try {
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const path = `portfolios/${profileId}/${entryId}/${timestamp}_${sanitizedName}`

    // Upload to Storage (bucket: 'portfolios')
    const { error: uploadError } = await supabase
      .storage
      .from('portfolios')
      .upload(path, file, { 
        upsert: true, 
        contentType: file.type 
      })

    if (uploadError) return fail(uploadError)

    // Insert DB record (store only path, not URL)
    const { data, error: dbError } = await supabase
      .from('portfolio_files')
      .insert([{ 
        entry_id: entryId, 
        storage_path: path, 
        mime_type: file.type 
      }])
      .select('id, entry_id, storage_path, mime_type, uploaded_at')
      .single()

    if (dbError) return fail(dbError)

    // Return data without URL (URL is generated on-demand)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Get signed URL for a file (generated on-demand)
 * Bucket: 'portfolios' (plural)
 * @param {string} path - Storage path
 * @param {number} expiresIn - Expiration in seconds (default 3600)
 * @returns {Promise<{ok: boolean, data?: string, error?: Object}>}
 */
export const getSignedUrl = async (path, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase
      .storage
      .from('portfolios')
      .createSignedUrl(path, expiresIn)

    if (error) return fail(error)
    return ok(data?.signedUrl || null)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Delete a portfolio file
 * Bucket: 'portfolios' (plural)
 * @param {number} fileId - File ID
 * @returns {Promise<{ok: boolean, data?: boolean, error?: Object}>}
 */
export const deletePortfolioFile = async (fileId) => {
  try {
    // Get file path first
    const { data: row, error: selectError } = await supabase
      .from('portfolio_files')
      .select('id, storage_path')
      .eq('id', fileId)
      .single()

    if (selectError) return fail(selectError)

    // Delete from Storage (bucket: 'portfolios')
    const { error: storageError } = await supabase
      .storage
      .from('portfolios')
      .remove([row.storage_path])

    if (storageError) {
      console.warn('Storage delete failed:', storageError)
      // Continue anyway - file might not exist
    }

    // Delete DB record
    const { error: dbError } = await supabase
      .from('portfolio_files')
      .delete()
      .eq('id', fileId)

    if (dbError) return fail(dbError)

    return ok(true)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Delete a portfolio entry (and all its files)
 * Bucket: 'portfolios' (plural)
 * @param {number} entryId - Entry ID
 * @returns {Promise<{ok: boolean, data?: boolean, error?: Object}>}
 */
export const deletePortfolioEntry = async (entryId) => {
  try {
    // Get all files for this entry
    const { data: files, error: filesError } = await supabase
      .from('portfolio_files')
      .select('id, storage_path')
      .eq('entry_id', entryId)

    if (filesError) return fail(filesError)

    // Delete files from Storage (bucket: 'portfolios')
    if (files && files.length > 0) {
      const paths = files.map(f => f.storage_path)
      const { error: storageError } = await supabase
        .storage
        .from('portfolios')
        .remove(paths)

      if (storageError) {
        console.warn('Storage bulk delete failed:', storageError)
        // Continue anyway
      }

      // Delete file records from DB
      const { error: filesDbError } = await supabase
        .from('portfolio_files')
        .delete()
        .eq('entry_id', entryId)

      if (filesDbError) return fail(filesDbError)
    }

    // Delete entry
    const { error: entryError } = await supabase
      .from('portfolio_entries')
      .delete()
      .eq('id', entryId)

    if (entryError) return fail(entryError)

    return ok(true)
  } catch (e) {
    return fail(e)
  }
}
