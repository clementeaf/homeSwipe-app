import React from 'react';
import Sidebar from './Sidebar';
import type { SidebarItem } from '../types';

interface DisplayLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  onSidebarItemClick: (item: SidebarItem) => void;
  headerContent?: React.ReactNode;
  sidebarTitle?: string;
  sidebarSubtitle?: string;
}

const DisplayLayout: React.FC<DisplayLayoutProps> = ({
  children,
  sidebarItems,
  onSidebarItemClick,
  sidebarTitle = "HomeSwipe",
  sidebarSubtitle = "Real Estate Platform"
}) => {
  return (
    <div className="flex h-screen bg-white p-6 gap-6">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        variant="default"
        position="left"
        showHeader={true}
        headerTitle={sidebarTitle}
        headerSubtitle={sidebarSubtitle}
        onItemClick={onSidebarItemClick}
      />
      {/* Main Content Area */}
      <main className="flex-1 w-full h-full p-0 m-0 overflow-auto bg-gray-100 flex flex-col rounded-lg">
        {children}
      </main>
    </div>
  );
};

export default DisplayLayout; 