import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
} from 'react-router-dom';
import Layout from './Layout.jsx';
import AppBackground from './components/layout/AppBackground.jsx';
import Home from './pages/Home/home.jsx';
import SplitExpensePage from './pages/expenses/SplitExpensePage.jsx';

// Wrapper for full-screen sub-pages (keeps global background, hides main Header/Footer)
function FullscreenLayout() {
  return (
    <div className="relative min-h-screen bg-transparent text-slate-900 dark:text-white">
      <AppBackground />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Main Tab Routes WITH Header & Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Full-Screen Sub-Pages WITHOUT Header & Footer */}
      <Route element={<FullscreenLayout />}>
        <Route path="/split-expense" element={<SplitExpensePage />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);