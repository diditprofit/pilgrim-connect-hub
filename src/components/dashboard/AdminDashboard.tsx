import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Package, 
  CreditCard, 
  FileText,
  Settings,
  Building,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminDashboard({ activeTab, onTabChange }: AdminDashboardProps) {
  const { user, users, packages, registrations } = useAuth();

  const totalRevenue = registrations.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalJamaah = registrations.length;
  const totalAgents = users.filter(u => u.role === 'agen').length;

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
        <h2 className="text-2xl font-bold">Dashboard Administrator</h2>
        <p className="text-muted-foreground">Selamat datang, {user?.name}</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jamaah</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalJamaah}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Building className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">{totalAgents}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">
              {packages.filter(p => p.status === 'open').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kelola Paket</CardTitle>
            <CardDescription>Buat dan edit paket Umrah & Hajj</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onTabChange('packages')} className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Kelola Paket
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manajemen User</CardTitle>
            <CardDescription>Kelola jamaah, agen, dan cabang</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onTabChange('users')} variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Kelola Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sistem Pembayaran</CardTitle>
            <CardDescription>Konfigurasi pembayaran & cicilan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onTabChange('payments')} variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Pengaturan Bayar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pendaftaran Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada pendaftaran</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.slice(0, 5).map((registration) => {
                  const pkg = packages.find(p => p.id === registration.packageId);
                  return (
                    <div key={registration.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{pkg?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(registration.paidAmount)} / {formatCurrency(registration.totalAmount)}
                        </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Package Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{pkg.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {pkg.registered}/{pkg.quota}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(pkg.registered / pkg.quota) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Kelola Paket</h2>
        <p className="text-muted-foreground">Buat dan kelola paket Umrah & Hajj</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Paket</CardTitle>
          <CardDescription>Kelola semua paket perjalanan ibadah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.duration} • {pkg.departureDate}
                      </p>
                    </div>
                    <Badge variant={pkg.status === 'open' ? 'default' : 'secondary'}>
                      {pkg.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Harga:</span>
                      <p className="font-semibold">{formatCurrency(pkg.price)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">DP Min:</span>
                      <p className="font-semibold">{formatCurrency(pkg.dpMin)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peserta:</span>
                      <p className="font-semibold">{pkg.registered}/{pkg.quota}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button className="w-full mt-4">
            <Package className="h-4 w-4 mr-2" />
            Tambah Paket Baru
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeTab) {
    case 'packages':
      return renderPackages();
    default:
      return renderDashboard();
  }
}