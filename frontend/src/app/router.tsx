import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/app-shell';
import { AdminProductsPage } from '../pages/admin/admin-products.page';
import { CustomerProductDetailsPage } from '../pages/customer/customer-product-details.page';
import { CustomerProductsPage } from '../pages/customer/customer-products.page';
import { PurchaseResultPage } from '../pages/customer/purchase-result.page';

// Start with a small route tree so later UI tasks can fill in real screens without rewiring app setup.
export const appRouter = createBrowserRouter([
  {
    children: [
      {
        element: <CustomerProductsPage />,
        path: '/',
      },
      {
        element: <CustomerProductDetailsPage />,
        path: '/products/:productId',
      },
      {
        element: <PurchaseResultPage />,
        path: '/purchase-result',
      },
      {
        element: <AdminProductsPage />,
        path: '/admin/products',
      },
    ],
    element: <AppShell />,
  },
]);
