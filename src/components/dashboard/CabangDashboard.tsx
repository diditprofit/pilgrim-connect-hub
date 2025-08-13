import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useECourse } from '@/contexts/ECourseContext';
import { CourseCard } from '@/components/ecourse/CourseCard';
import { CourseViewer } from '@/components/ecourse/CourseViewer';
import { CertificateViewer } from '@/components/ecourse/CertificateViewer';
import { 
  Users, 
  TrendingUp, 
  Package, 
  FileText,
  Settings,
  DollarSign,
  Target,
  Award,
  GraduationCap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CabangDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CabangDashboard({ activeTab, onTabChange }: CabangDashboardProps) {
  const { user, users, registrations, packages } = useAuth();
  const { getCoursesForRole, getCourseProgress, startCourse } = useECourse();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<string | null>(null);

  const branchAgents = users.filter(u => u.role === 'agen' && u.branchId === user?.branchId);
  const branchRegistrations = registrations.filter(r => {
    const agent = users.find(u => u.id === r.agentId);
    return agent && agent.branchId === user?.branchId;
  });

  const totalRevenue = branchRegistrations.reduce((acc, r) => acc + r.paidAmount, 0);
  const pendingApprovals = branchRegistrations.filter(r => r.status === 'dp').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Dashboard Branch Manager</h2>
        <p className="text-muted-foreground">Selamat datang, {user?.name}</p>
        <Badge variant="secondary">Branch ID: {user?.branchId}</Badge>
      </div>

      {/* Branch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agen</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{branchAgents.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">
              {pendingApprovals}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              {branchRegistrations.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => onTabChange('approvals')} className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Approvals
            </Button>
            <Button onClick={() => onTabChange('agents')} variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Agents
            </Button>
            <Button onClick={() => onTabChange('reports')} variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Branch Reports
            </Button>
            <Button onClick={() => onTabChange('ecourse')} variant="outline" className="w-full justify-start">
              <GraduationCap className="h-4 w-4 mr-2" />
              Management Training
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Active Agents</span>
                <span className="text-sm font-medium">{branchAgents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Month Revenue</span>
                <span className="text-sm font-medium">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="text-sm font-medium">
                  {branchRegistrations.length > 0 
                    ? Math.round((branchRegistrations.filter(r => r.status !== 'draft').length / branchRegistrations.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {branchRegistrations.length === 0 ? (
            <div className="text-center py-6">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {branchRegistrations.slice(0, 5).map((registration) => {
                const pkg = packages.find(p => p.id === registration.packageId);
                const agent = users.find(u => u.id === registration.agentId);
                return (
                  <div key={registration.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{pkg?.name}</h4>
                      <p className="text-sm text-muted-foreground">Agent: {agent?.name}</p>
                    </div>
                    <Badge variant={registration.status === 'lunas' ? 'default' : 'secondary'}>
                      {registration.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderECourse = () => {
    const courses = getCoursesForRole('cabang');

    if (viewingCertificate) {
      const course = courses.find(c => c.id === viewingCertificate);
      const progress = getCourseProgress(viewingCertificate);
      if (course && progress) {
        return (
          <CertificateViewer
            course={course}
            progress={progress}
            onBack={() => setViewingCertificate(null)}
          />
        );
      }
    }

    if (selectedCourse) {
      const course = courses.find(c => c.id === selectedCourse);
      if (course) {
        return (
          <CourseViewer
            course={course}
            onBack={() => setSelectedCourse(null)}
          />
        );
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Management Training</h2>
          <p className="text-muted-foreground">Kursus khusus untuk Branch Manager dalam mengelola cabang dan tim</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = getCourseProgress(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress}
                onStart={() => {
                  startCourse(course.id);
                  setSelectedCourse(course.id);
                }}
                onContinue={() => setSelectedCourse(course.id)}
                onViewCertificate={progress?.certificateIssued ? () => setViewingCertificate(course.id) : undefined}
              />
            );
          })}
        </div>
      </div>
    );
  };

  switch (activeTab) {
    case 'ecourse':
      return renderECourse();
    default:
      return renderDashboard();
  }
}