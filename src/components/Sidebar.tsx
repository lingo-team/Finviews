import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  PieChart,
  Newspaper,
  Star,
  Settings,
  BookOpen,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Markets', path: '/markets' },
  { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
  { icon: Newspaper, label: 'Forums', path: '/forums' },
  { icon: BookOpen, label: 'Research', path: '/research' },
  { icon: Star, label: 'Personal Advisor', path: '/personal' }
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6 text-gray-600" />
      ) : (
        <Menu className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-0 z-40' : 'absolute top-0 left-0'}
    ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
    w-64 bg-white h-screen border-r border-gray-200 transition-transform duration-200 ease-in-out
  `;

  return (
    <>
      <MobileMenuButton />
      <div className={sidebarClasses}>
        <div className="flex items-center space-x-2 px-6 py-4 border-b border-gray-200">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">FinView</span>
        </div>

        <nav className="mt-6 flex flex-col h-[calc(100%-4rem)] justify-between">
          <div>
            {menuItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                  showSettings ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              </button>

              {showSettings && (
                <div className="absolute bottom-full left-0 w-full bg-white border border-gray-100 rounded-t-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}