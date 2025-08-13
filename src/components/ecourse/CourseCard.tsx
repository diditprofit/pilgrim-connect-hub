import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course, CourseProgress } from '@/contexts/ECourseContext';
import { Clock, BookOpen, Award, Play } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  onStart: () => void;
  onContinue: () => void;
  onViewCertificate?: () => void;
}

export function CourseCard({ course, progress, onStart, onContinue, onViewCertificate }: CourseCardProps) {
  const isStarted = !!progress;
  const isCompleted = progress?.progress === 100;
  const hasCertificate = progress?.certificateIssued;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
          <Badge variant="secondary">{course.category}</Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDuration(course.totalDuration)}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.lessons.length} lessons
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progress.completedLessons.length} of {course.lessons.length} lessons completed
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isStarted && (
            <Button onClick={onStart} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Course
            </Button>
          )}
          
          {isStarted && !isCompleted && (
            <Button onClick={onContinue} className="flex-1">
              Continue Learning
            </Button>
          )}
          
          {isCompleted && !hasCertificate && (
            <Button onClick={onContinue} variant="outline" className="flex-1">
              Review Course
            </Button>
          )}
          
          {hasCertificate && onViewCertificate && (
            <Button onClick={onViewCertificate} variant="outline" className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}