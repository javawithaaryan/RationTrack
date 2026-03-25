'use client';

import { useState, useEffect } from 'react';
import { AppProvider } from '@/lib/store';
import { BottomNav } from '@/components/BottomNav';
import { SidebarNav } from '@/components/SidebarNav';
import { AdminDashboard } from '@/components/AdminDashboard';
import { DealerPanel } from '@/components/DealerPanel';
import { CitizenPortal } from '@/components/CitizenPortal';
import { AlertsPage } from '@/components/AlertsPage';
import { MapVisualization } from '@/components/MapVisualization';
import { Toast } from '@/components/Toast';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dealer');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'dealer':
        return <DealerPanel />;
      case 'citizen':
        return <CitizenPortal />;
      case 'alerts':
        return <AlertsPage />;
      case 'map':
        return <MapVisualization />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-20 md:pb-0 overflow-auto">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Toast Notifications */}
        <Toast />
      </div>
    </AppProvider>
  );
}
