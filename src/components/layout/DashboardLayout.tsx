import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Plane,
  UserCheck,
  Building,
  Calculator
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ];

    switch (user?.role) {
      case 'jamaah':
        return [
          ...baseItems,
          { id: 'packages', label: 'Paket Tersedia', icon: Package },
          { id: 'registration', label: 'Pendaftaran Saya', icon: FileText },
          { id: 'payments', label: 'Pembayaran', icon: CreditCard },
          { id: 'documents', label: 'Dokumen', icon: FileText },
          { id: 'savings', label: 'Tabungan', icon: TrendingUp },
          { id: 'upgrade', label: 'Upgrade ke Agen', icon: UserCheck }
        ];
      
      case 'agen':
        return [
          ...baseItems,
          { id: 'leads', label: 'Leads Pipeline', icon: Users },
          { id: 'registrations', label: 'Pendaftaran', icon: FileText },
          { id: 'commissions', label: 'Komisi', icon: TrendingUp },
          { id: 'referrals', label: 'Link Referral', icon: Plane },
          { id: 'materials', label: 'Materi Promosi', icon: Package }
        ];
      
      case 'cabang':
        return [
          ...baseItems,
          { id: 'agents', label: 'Daftar Agen', icon: Users },
          { id: 'performance', label: 'Performa Cabang', icon: TrendingUp },
          { id: 'payments', label: 'Laporan Pembayaran', icon: CreditCard },
          { id: 'documents', label: 'Verifikasi Dokumen', icon: FileText }
        ];
      
      case 'bendahara':
        return [
          ...baseItems,
          { id: 'verification', label: 'Verifikasi Pembayaran', icon: CreditCard },
          { id: 'commissions', label: 'Proses Komisi', icon: Calculator },
          { id: 'reports', label: 'Laporan Keuangan', icon: FileText },
          { id: 'overdue', label: 'Tunggakan', icon: TrendingUp }
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { id: 'packages', label: 'Kelola Paket', icon: Package },
          { id: 'users', label: 'Manajemen User', icon: Users },
          { id: 'branches', label: 'Cabang', icon: Building },
          { id: 'payments', label: 'Sistem Pembayaran', icon: CreditCard },
          { id: 'notifications', label: 'Notifikasi WA', icon: FileText },
          { id: 'settings', label: 'Pengaturan', icon: Settings }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      jamaah: 'Jamaah',
      agen: 'Agen',
      cabang: 'Manager Cabang',
      bendahara: 'Bendahara Pusat',
      admin: 'Administrator'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Umrah & Hajj
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(user?.role || '')}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-md" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}