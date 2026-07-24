import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../pages/dashboard/Header";
import Sidebar from "../../pages/dashboard/SideBar";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex bg-muted/30">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;