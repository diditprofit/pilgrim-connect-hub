import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  CreditCard, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Plane,
  MapPin,
  UserCheck
} from 'lucide-react';

interface JamaahDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function JamaahDashboard({ activeTab, onTabChange }: JamaahDashboardProps) {
  const { user, packages, registrations, createRegistration, updateRegistrationPayment, upgradeToAgent } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const userRegistrations = registrations.filter(r => r.jamaahId === user?.id);
  const activeRegistration = userRegistrations.find(r => ['dp', 'lunas', 'issued'].includes(r.status));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      dp: { label: 'DP Dibayar', variant: 'default' as const },
      lunas: { label: 'Lunas', variant: 'default' as const },
      issued: { label: 'Tiket Terbit', variant: 'default' as const },
      berangkat: { label: 'Berangkat', variant: 'default' as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Dashboard Jamaah</h2>
        <p className="text-muted-foreground">Selamat datang, {user?.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Pendaftaran</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {activeRegistration ? getStatusBadge(activeRegistration.status) : 'Belum Daftar'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dibayar</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(activeRegistration?.paidAmount || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Pembayaran</CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              {formatCurrency(activeRegistration?.remainingAmount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Registration */}
      {activeRegistration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Pendaftaran Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {packages.find(p => p.id === activeRegistration.packageId)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {packages.find(p => p.id === activeRegistration.packageId)?.duration} • 
                  Keberangkatan: {packages.find(p => p.id === activeRegistration.packageId)?.departureDate}
                </p>
              </div>
              {getStatusBadge(activeRegistration.status)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress Pembayaran</span>
                <span>{Math.round((activeRegistration.paidAmount / activeRegistration.totalAmount) * 100)}%</span>
              </div>
              <Progress 
                value={(activeRegistration.paidAmount / activeRegistration.totalAmount) * 100} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Paket:</span>
                <p className="font-semibold">{formatCurrency(activeRegistration.totalAmount)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Sudah Dibayar:</span>
                <p className="font-semibold text-success">{formatCurrency(activeRegistration.paidAmount)}</p>
              </div>
            </div>

            <Button 
              onClick={() => onTabChange('payments')} 
              className="w-full bg-gradient-to-r from-primary to-primary-light"
            >
              Kelola Pembayaran
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Document Checklist */}
      {activeRegistration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Status Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(activeRegistration.documents).map(([doc, completed]) => (
                <div key={doc} className="flex items-center space-x-2">
                  {completed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm capitalize">{doc}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => onTabChange('documents')} 
              className="w-full mt-4"
            >
              Kelola Dokumen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Packages */}
      {!activeRegistration && (
        <Card>
          <CardHeader>
            <CardTitle>Paket Tersedia</CardTitle>
            <CardDescription>Pilih paket Umrah atau Hajj yang sesuai dengan kebutuhan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {packages.slice(0, 2).map((pkg) => (
                <Card key={pkg.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <Badge variant={pkg.status === 'open' ? 'default' : 'secondary'}>
                        {pkg.status === 'open' ? 'Tersedia' : pkg.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pkg.duration} • Keberangkatan: {pkg.departureDate}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</p>
                        <p className="text-sm text-muted-foreground">DP min: {formatCurrency(pkg.dpMin)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pkg.registered}/{pkg.quota} terdaftar
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => onTabChange('packages')} variant="outline" className="w-full mt-4">
              Lihat Semua Paket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Paket Tersedia</h2>
        <p className="text-muted-foreground">Pilih paket perjalanan ibadah Anda</p>
      </div>

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Keberangkatan: {pkg.departureDate}
                    </div>
                  </div>
                </div>
                <Badge variant={pkg.status === 'open' ? 'default' : 'secondary'}>
                  {pkg.status === 'open' ? 'Tersedia' : pkg.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Harga Paket</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(pkg.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DP Minimum</p>
                  <p className="text-lg font-semibold text-accent">{formatCurrency(pkg.dpMin)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kuota</p>
                  <p className="text-lg font-semibold">
                    {pkg.registered}/{pkg.quota} peserta
                  </p>
                  <Progress value={(pkg.registered / pkg.quota) * 100} className="mt-1 h-2" />
                </div>
              </div>

              <Button
                onClick={() => {
                  if (user) {
                    createRegistration(pkg.id, user.id);
                    onTabChange('registration');
                  }
                }}
                disabled={pkg.status !== 'open' || activeRegistration !== undefined}
                className="w-full bg-gradient-to-r from-primary to-primary-light"
              >
                {activeRegistration ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pendaftaran Saya</h2>
        <p className="text-muted-foreground">Status dan detail pendaftaran Anda</p>
      </div>

      {userRegistrations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Pendaftaran</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum mendaftar paket apapun. Silakan pilih paket yang tersedia.
            </p>
            <Button onClick={() => onTabChange('packages')}>
              Lihat Paket Tersedia
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userRegistrations.map((registration) => {
            const pkg = packages.find(p => p.id === registration.packageId);
            return (
              <Card key={registration.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{pkg?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Terdaftar: {registration.createdAt}
                      </p>
                    </div>
                    {getStatusBadge(registration.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paket</p>
                      <p className="font-semibold">{formatCurrency(registration.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sudah Dibayar</p>
                      <p className="font-semibold text-success">{formatCurrency(registration.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sisa Pembayaran</p>
                      <p className="font-semibold text-warning">{formatCurrency(registration.remainingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-semibold">{Math.round((registration.paidAmount / registration.totalAmount) * 100)}%</p>
                    </div>
                  </div>

                  <Progress 
                    value={(registration.paidAmount / registration.totalAmount) * 100} 
                    className="mb-4 h-2"
                  />

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onTabChange('payments')} 
                      variant="outline"
                      size="sm"
                    >
                      Bayar Cicilan
                    </Button>
                    <Button 
                      onClick={() => onTabChange('documents')} 
                      variant="outline"
                      size="sm"
                    >
                      Upload Dokumen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pembayaran</h2>
        <p className="text-muted-foreground">Kelola pembayaran dan cicilan Anda</p>
      </div>

      {activeRegistration ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Paket</p>
                  <p className="text-xl font-bold">{formatCurrency(activeRegistration.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sudah Dibayar</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(activeRegistration.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sisa Pembayaran</p>
                  <p className="text-xl font-bold text-warning">{formatCurrency(activeRegistration.remainingAmount)}</p>
                </div>
              </div>
              
              <Progress 
                value={(activeRegistration.paidAmount / activeRegistration.totalAmount) * 100} 
                className="h-3"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bayar Cicilan</CardTitle>
              <CardDescription>Pilih nominal pembayaran cicilan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1000000, 2500000, 5000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-16 flex flex-col"
                    onClick={() => updateRegistrationPayment(activeRegistration.id, amount)}
                    disabled={amount > activeRegistration.remainingAmount}
                  >
                    <span className="text-lg font-bold">{formatCurrency(amount)}</span>
                    <span className="text-xs text-muted-foreground">Bayar Sekarang</span>
                  </Button>
                ))}
              </div>
              
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-success to-success/80"
                onClick={() => updateRegistrationPayment(activeRegistration.id, activeRegistration.remainingAmount)}
                disabled={activeRegistration.remainingAmount <= 0}
              >
                Bayar Lunas - {formatCurrency(activeRegistration.remainingAmount)}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak Ada Pembayaran Aktif</h3>
            <p className="text-muted-foreground">
              Daftar paket terlebih dahulu untuk mulai melakukan pembayaran.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderUpgrade = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Upgrade ke Agen</h2>
        <p className="text-muted-foreground">Bergabung sebagai agen dan dapatkan komisi dari setiap penjualan</p>
      </div>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mx-auto">
              <UserCheck className="h-8 w-8 text-accent-foreground" />
            </div>
            
            <h3 className="text-xl font-bold">Paket Upgrade Agen</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upgrade akun Anda menjadi agen dan dapatkan keuntungan berlimpah dari setiap penjualan paket.
            </p>
            
            <div className="text-3xl font-bold text-accent">Rp 275.000</div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Materi promosi lengkap</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Voucher pelatihan</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Sistem komisi otomatis</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Link referral personal</span>
              </div>
            </div>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-accent to-accent-light text-accent-foreground hover:from-accent/90 hover:to-accent-light/90"
              onClick={() => {
                if (user) {
                  // Simulate payment verification and upgrade
                  setTimeout(() => {
                    upgradeToAgent(user.id);
                    onTabChange('dashboard');
                  }, 1000);
                }
              }}
            >
              Upgrade Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeTab) {
    case 'packages':
      return renderPackages();
    case 'registration':
      return renderRegistration();
    case 'payments':
      return renderPayments();
    case 'upgrade':
      return renderUpgrade();
    default:
      return renderDashboard();
  }
}