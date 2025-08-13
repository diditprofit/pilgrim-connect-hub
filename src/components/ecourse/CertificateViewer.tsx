import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course, CourseProgress } from '@/contexts/ECourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2, Calendar } from 'lucide-react';

interface CertificateViewerProps {
  course: Course;
  progress: CourseProgress;
  onBack: () => void;
}

export function CertificateViewer({ course, progress, onBack }: CertificateViewerProps) {
  const { user } = useAuth();

  const completionDate = progress.completedAt 
    ? new Date(progress.completedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const certificateId = `CERT-${course.id}-${user?.id}-${progress.completedAt?.split('T')[0]}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Courses
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <Award className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Certificate of Completion</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto"></div>
            </div>

            {/* Content */}
            <div className="space-y-6 py-8">
              <p className="text-lg text-muted-foreground">This is to certify that</p>
              
              <h2 className="text-4xl font-bold text-foreground">{user?.name}</h2>
              
              <p className="text-lg text-muted-foreground">has successfully completed the course</p>
              
              <h3 className="text-2xl font-semibold text-primary">{course.title}</h3>
              
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="text-center">
                  <p className="font-medium">Duration</p>
                  <p>{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Lessons</p>
                  <p>{course.lessons.length}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Category</p>
                  <p>{course.category}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Completed on {completionDate}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <p>Certificate ID: {certificateId}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Umrah & Hajj Management System</p>
                  <p>Training & Development Division</p>
                </div>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                Verified Digital Certificate
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Info */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium">Certificate ID</p>
              <p className="text-sm text-muted-foreground font-mono">{certificateId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Issue Date</p>
              <p className="text-sm text-muted-foreground">{completionDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Course Completion</p>
              <p className="text-sm text-muted-foreground">{progress.progress}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Template</p>
              <p className="text-sm text-muted-foreground">{course.certificateTemplate}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              This certificate can be verified by sharing the certificate ID with employers or 
              educational institutions. The certificate is digitally signed and tamper-proof.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}