import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'jamaah' | 'agen' | 'cabang' | 'bendahara' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;
  agentCode?: string;
  phone?: string;
}

export interface Package {
  id: string;
  name: string;
  type: 'umrah' | 'hajj_onh' | 'hajj_furoda';
  price: number;
  dpMin: number;
  quota: number;
  registered: number;
  departureDate: string;
  duration: string;
  status: 'open' | 'closed' | 'full';
}

export interface Registration {
  id: string;
  jamaahId: string;
  packageId: string;
  agentId?: string;
  status: 'draft' | 'dp' | 'lunas' | 'issued' | 'berangkat';
  totalAmount: number;
  dpAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
  documents: {
    passport: boolean;
    id: boolean;
    vaccine: boolean;
    visa: boolean;
    ticket: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  users: User[];
  packages: Package[];
  registrations: Registration[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  upgradeToAgent: (userId: string) => void;
  createRegistration: (packageId: string, jamaahId: string, agentId?: string) => void;
  updateRegistrationStatus: (registrationId: string, status: Registration['status']) => void;
  updateRegistrationPayment: (registrationId: string, amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'jamaah@test.com', name: 'Ahmad Jamaah', role: 'jamaah', phone: '+6281234567890' },
  { id: '2', email: 'agen@test.com', name: 'Siti Agen', role: 'agen', agentCode: 'AG001', branchId: 'BR001', phone: '+6281234567891' },
  { id: '3', email: 'cabang@test.com', name: 'Budi Manager', role: 'cabang', branchId: 'BR001', phone: '+6281234567892' },
  { id: '4', email: 'bendahara@test.com', name: 'Dewi Treasurer', role: 'bendahara', phone: '+6281234567893' },
  { id: '5', email: 'admin@test.com', name: 'Admin System', role: 'admin', phone: '+6281234567894' },
];

const mockPackages: Package[] = [
  {
    id: 'P001',
    name: 'Umrah Ekonomi Januari 2024',
    type: 'umrah',
    price: 25000000,
    dpMin: 5000000,
    quota: 45,
    registered: 32,
    departureDate: '2024-01-15',
    duration: '12 hari',
    status: 'open'
  },
  {
    id: 'P002',
    name: 'Hajj ONH Plus 2024',
    type: 'hajj_onh',
    price: 45000000,
    dpMin: 10000000,
    quota: 40,
    registered: 38,
    departureDate: '2024-06-10',
    duration: '40 hari',
    status: 'open'
  },
  {
    id: 'P003',
    name: 'Hajj Furoda Premium 2024',
    type: 'hajj_furoda',
    price: 85000000,
    dpMin: 20000000,
    quota: 20,
    registered: 15,
    departureDate: '2024-06-05',
    duration: '45 hari',
    status: 'open'
  }
];

const mockRegistrations: Registration[] = [
  {
    id: 'R001',
    jamaahId: '1',
    packageId: 'P001',
    agentId: '2',
    status: 'dp',
    totalAmount: 25000000,
    dpAmount: 5000000,
    paidAmount: 5000000,
    remainingAmount: 20000000,
    createdAt: '2024-01-01',
    documents: {
      passport: true,
      id: true,
      vaccine: false,
      visa: false,
      ticket: false
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [packages] = useState<Package[]>(mockPackages);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);

  useEffect(() => {
    const savedUser = localStorage.getItem('umrah_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('umrah_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('umrah_user');
  };

  const upgradeToAgent = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, role: 'agen' as UserRole, agentCode: `AG${Date.now()}` }
        : u
    );
    setUsers(updatedUsers);
    
    if (user?.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('umrah_user', JSON.stringify(updatedUser));
      }
    }
  };

  const createRegistration = (packageId: string, jamaahId: string, agentId?: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      const newRegistration: Registration = {
        id: `R${Date.now()}`,
        jamaahId,
        packageId,
        agentId,
        status: 'draft',
        totalAmount: pkg.price,
        dpAmount: 0,
        paidAmount: 0,
        remainingAmount: pkg.price,
        createdAt: new Date().toISOString().split('T')[0],
        documents: {
          passport: false,
          id: false,
          vaccine: false,
          visa: false,
          ticket: false
        }
      };
      setRegistrations(prev => [...prev, newRegistration]);
    }
  };

  const updateRegistrationStatus = (registrationId: string, status: Registration['status']) => {
    setRegistrations(prev => 
      prev.map(r => r.id === registrationId ? { ...r, status } : r)
    );
  };

  const updateRegistrationPayment = (registrationId: string, amount: number) => {
    setRegistrations(prev => 
      prev.map(r => {
        if (r.id === registrationId) {
          const newPaidAmount = r.paidAmount + amount;
          const newRemainingAmount = r.totalAmount - newPaidAmount;
          let newStatus = r.status;
          
          if (newPaidAmount >= r.totalAmount) {
            newStatus = 'lunas';
          } else if (newPaidAmount > 0) {
            newStatus = 'dp';
          }
          
          return {
            ...r,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            dpAmount: r.dpAmount === 0 ? amount : r.dpAmount
          };
        }
        return r;
      })
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      packages,
      registrations,
      login,
      logout,
      upgradeToAgent,
      createRegistration,
      updateRegistrationStatus,
      updateRegistrationPayment
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}