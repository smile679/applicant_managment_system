import { NavLink } from "react-router-dom";
import { MdBiotech } from "react-icons/md";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiOutlineViewGrid, HiOutlineUsers } from "react-icons/hi";
import { Button } from "../../components/ui/button";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
  { to: "/dashboard/applicants", label: "Applicants", icon: HiOutlineUsers },
];

const Sidebar = ({ collapsed, onToggle, mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          flex flex-col border-r bg-background
          transition-all duration-200
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b">
          <MdBiotech className="size-9 text-blue-500 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-base font-bold leading-tight">APPLICANT</h1>
              <h3 className="text-xs tracking-widest text-muted-foreground leading-tight">
                MANAGEMENT
              </h3>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:block border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={onToggle}
          >
            {collapsed ? (
              <HiChevronRight className="size-5" />
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                <HiChevronLeft className="size-5" /> Collapse
              </span>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;