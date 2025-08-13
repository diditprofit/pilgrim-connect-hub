import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  Package, 
  FileText,
  Link,
  DollarSign,
  Target,
  Award
} from 'lucide-react';

interface AgenDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AgenDashboard({ activeTab, onTabChange }: AgenDashboardProps) {
  const { user, registrations, packages } = useAuth();

  const agentRegistrations = registrations.filter(r => r.agentId === user?.id);
  const totalCommission = agentRegistrations.reduce((acc, r) => {
    if (r.status === 'dp' || r.status === 'lunas') {
      return acc + (r.dpAmount * 0.05); // 5% commission on DP
    }
    return acc;
  }, 0);

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
        <h2 className="text-2xl font-bold">Dashboard Agen</h2>
        <p className="text-muted-foreground">Selamat datang, {user?.name}</p>
        <Badge variant="secondary">Kode Agen: {user?.agentCode}</Badge>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jamaah</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{agentRegistrations.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Komisi</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(totalCommission)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jamaah Lunas</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              {agentRegistrations.filter(r => r.status === 'lunas').length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info-foreground">
              {agentRegistrations.length > 0 
                ? Math.round((agentRegistrations.filter(r => r.status !== 'draft').length / agentRegistrations.length) * 100)
                : 0}%
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
            <Button onClick={() => onTabChange('referrals')} className="w-full justify-start">
              <Link className="h-4 w-4 mr-2" />
              Generate Link Referral
            </Button>
            <Button onClick={() => onTabChange('materials')} variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Download Materi Promosi
            </Button>
            <Button onClick={() => onTabChange('leads')} variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Kelola Leads
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Komisi Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">
              {formatCurrency(totalCommission)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Dari {agentRegistrations.length} jamaah terdaftar
            </p>
            <Button onClick={() => onTabChange('commissions')} variant="outline" className="w-full">
              Lihat Detail Komisi
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Pendaftaran Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {agentRegistrations.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada jamaah yang terdaftar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agentRegistrations.slice(0, 5).map((registration) => {
                const pkg = packages.find(p => p.id === registration.packageId);
                return (
                  <div key={registration.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{pkg?.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {registration.id}</p>
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

  const renderReferrals = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Link Referral</h2>
        <p className="text-muted-foreground">Bagikan link referral Anda untuk mendapatkan komisi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Referral Anda</CardTitle>
          <CardDescription>Gunakan link ini untuk mempromosikan paket Umrah & Hajj</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded border border-dashed">
            <code className="text-sm break-all">
              https://umrahhajj.com/register?ref={user?.agentCode}
            </code>
          </div>
          <Button className="w-full">
            <Link className="h-4 w-4 mr-2" />
            Salin Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Klik Link</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-muted-foreground">Pendaftaran</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">0%</div>
              <div className="text-sm text-muted-foreground">Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{formatCurrency(0)}</div>
              <div className="text-sm text-muted-foreground">Komisi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeTab) {
    case 'referrals':
      return renderReferrals();
    default:
      return renderDashboard();
  }
}