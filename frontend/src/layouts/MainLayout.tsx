import { FC } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Car, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Button } from '../components/Button';

export const MainLayout: FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gradient-gold">AutoVault</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Premium Inventory</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Inventory Catalog
            </Link>
            {user?.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Console
              </span>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <UserIcon className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-200">{user?.name || 'User'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-rose-400">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoVault Systems. Production Architecture Foundation built for Incubyte Assessment.</p>
        </div>
      </footer>
    </div>
  );
};
