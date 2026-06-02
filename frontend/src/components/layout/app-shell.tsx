import { NavLink, Outlet } from 'react-router-dom';

export const AppShell = (): JSX.Element => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Nexus Exercise</p>
          <h1>Digital Coupon Marketplace</h1>
        </div>
        <nav className="app-nav" aria-label="Primary">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/admin/products">Admin</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};
