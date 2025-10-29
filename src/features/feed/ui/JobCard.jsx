import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { Separator } from '../../../components/ui/Separator'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
} from '../../../components/ui/Icons'

export const JobCard = ({ job, isLiked, isSaved, onLike, onSave, onApply }) => {
  return (
    <Card hover className="transition-all">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={job.companyLogo} alt={job.company} />
            <AvatarFallback>{job.company[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{job.company}</h3>
                  {job.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verificada
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{job.companySize}</p>
                <p className="text-xs text-muted-foreground">{job.timePosted}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={isSaved ? "text-primary" : ""}
                onClick={() => onSave(job.id)}
              >
                <Bookmark size={20} filled={isSaved} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Title & Description */}
        <div>
          <h2 className="mb-2 text-xl font-bold text-foreground">{job.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" size={16} />
            <span className="font-semibold text-primary">{job.budget}</span>
            <span>• {job.budgetType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="h-4 w-4" size={16} />
            <span>{job.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" size={16} />
            <span>{job.applicants} aplicantes</span>
          </div>
        </div>

        <Separator />

        {/* Engagement Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
              onClick={() => onLike(job.id)}
            >
              <Heart size={16} filled={isLiked} />
              <span>{job.likes}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle size={16} />
              <span>{job.comments}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 size={16} />
              <span>Compartir</span>
            </Button>
          </div>

          <Button onClick={() => onApply(job.id)}>
            Aplicar Ahora
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
