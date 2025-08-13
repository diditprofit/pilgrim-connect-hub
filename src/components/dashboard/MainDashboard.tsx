import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { JamaahDashboard } from './JamaahDashboard';
import { AgenDashboard } from './AgenDashboard';
import { AdminDashboard } from './AdminDashboard';

export function MainDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'jamaah':
        return <JamaahDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'agen':
        return <AgenDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'cabang':
        return <AgenDashboard activeTab={activeTab} onTabChange={setActiveTab} />; // Similar to agent for now
      case 'bendahara':
        return <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab} />; // Similar to admin for now
      case 'admin':
        return <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      default:
        return <div>Role tidak dikenali</div>;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}