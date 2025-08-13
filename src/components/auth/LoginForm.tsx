import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Lock } from 'lucide-react';
import heroImage from '@/assets/islamic-hero-bg.jpg';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di sistem manajemen Umrah & Hajj",
        });
      } else {
        toast({
          title: "Login Gagal",
          description: "Email atau password tidak valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'jamaah@test.com', role: 'Jamaah (Pilgrim)' },
    { email: 'agen@test.com', role: 'Agen (Agent)' },
    { email: 'cabang@test.com', role: 'Cabang Manager' },
    { email: 'bendahara@test.com', role: 'Bendahara Pusat' },
    { email: 'admin@test.com', role: 'Administrator' },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Umrah & Hajj Management
          </h1>
          <p className="text-white/80 drop-shadow">Sistem Manajemen Perjalanan Ibadah</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/90 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-center">
              Gunakan akun Anda untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">
              Password untuk semua akun: <code className="bg-background px-1 rounded">123456</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {demoAccounts.map((account, index) => (
              <div 
                key={index}
                className="flex justify-between items-center py-1 px-2 rounded-md hover:bg-background/50 cursor-pointer transition-colors"
                onClick={() => setEmail(account.email)}
              >
                <span className="text-xs font-mono">{account.email}</span>
                <span className="text-xs text-muted-foreground">{account.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}