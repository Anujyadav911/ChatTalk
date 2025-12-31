import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div>
          {/* Sidebar for mobile (drawer/modal) */}
          <div
            className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`fixed top-0 left-0 z-50 h-full w-64 bg-base-200 border-r border-base-300 shadow-lg transform transition-transform duration-200 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex">
        {/* Sidebar for desktop */}
        {showSidebar && <div className="hidden lg:flex"><Sidebar /></div>}

        <div className="flex-1 flex flex-col">
          {/* Navbar with sidebar toggle button for mobile */}
          <div className="relative">
            {showSidebar && !sidebarOpen && (
              <button
                className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-50 btn btn-ghost btn-circle"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Open sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Navbar />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
