import { Outlet, useNavigate } from 'react-router-dom';
import AppBackground from './components/layout/AppBackground';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';

function Layout({ unreadCount = 2, onNotificationClick, onProfileClick, onAddClick }) {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      navigate('/split-expense');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-slate-900 dark:text-white">
      {/* Fixed global background behind all pages */}
      <AppBackground />

      <Header
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick || (() => navigate('/notifications'))}
        onProfileClick={onProfileClick || (() => navigate('/profile'))}
      />

      {/* Transparent main viewport; pb-24 prevents content from hiding behind the fixed Footer */}
      <main className="grow bg-transparent pb-24">
        <Outlet />
      </main>

      <Footer onAddClick={handleAddClick} />
    </div>
  );
}

export default Layout;