import { useCallback, useState } from 'react';
import { AdminLoginPanel } from '../../components/products/admin-login-panel';
import { AdminProductForm } from '../../components/products/admin-product-form';
import { AdminProductList } from '../../components/products/admin-product-list';
import { ErrorState } from '../../components/ui/error-state';
import { ToastMessage } from '../../components/ui/toast-message';
import { useAdminProducts } from '../../hooks/use-admin-products';
import { useAdminSession } from '../../hooks/use-admin-session';
import { AdminLoginRequest } from '../../types/auth.types';
import { CreateCouponRequest } from '../../types/product.types';
import '../../styles/admin-products.css';

interface ToastState {
  message: string;
  tone: 'error' | 'success';
}

export const AdminProductsPage = (): JSX.Element => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const {
    accessToken,
    errorMessage: sessionErrorMessage,
    isSubmitting,
    login,
    logout,
  } = useAdminSession();
  const {
    createProduct,
    errorMessage: productsErrorMessage,
    isCreating,
    isLoading,
    products,
  } = useAdminProducts(accessToken);

  const dismissToast = useCallback((): void => {
    setToast(null);
  }, []);

  const handleLogin = async (loginInput: AdminLoginRequest): Promise<void> => {
    try {
      await login(loginInput);
      setToast({ message: 'Signed in successfully.', tone: 'success' });
    } catch {
      setToast({
        message: 'Unable to sign in with those credentials.',
        tone: 'error',
      });
    }
  };

  const handleCreateProduct = async (
    productInput: CreateCouponRequest,
  ): Promise<void> => {
    try {
      await createProduct(productInput);
      setToast({ message: 'Coupon created successfully.', tone: 'success' });
    } catch {
      setToast({
        message: 'Unable to create coupon right now.',
        tone: 'error',
      });
    }
  };

  const handleLogout = (): void => {
    logout();
    setToast({ message: 'Signed out successfully.', tone: 'success' });
  };

  return (
    <div className="admin-layout">
      {toast ? (
        <ToastMessage
          message={toast.message}
          onDismiss={dismissToast}
          tone={toast.tone}
        />
      ) : null}
      {!accessToken ? (
        <AdminLoginPanel
          errorMessage={sessionErrorMessage}
          isSubmitting={isSubmitting}
          onLogin={handleLogin}
        />
      ) : (
        <>
          <section className="page-card admin-panel">
            <div className="admin-list-heading">
              <div>
                <p className="eyebrow">Admin Workspace</p>
                <h2>Inventory command center</h2>
              </div>
              <button
                className="primary-button"
                onClick={handleLogout}
                type="button"
              >
                Sign Out
              </button>
            </div>
            <p className="admin-copy">
              You are authenticated and ready to create inventory records and
              review the current coupon catalog.
            </p>
          </section>
          {productsErrorMessage ? (
            <ErrorState
              message={productsErrorMessage}
              title="Unable to sync inventory"
            />
          ) : null}
          <AdminProductForm
            isSubmitting={isCreating}
            onCreateProduct={handleCreateProduct}
          />
          <AdminProductList isLoading={isLoading} products={products} />
        </>
      )}
    </div>
  );
};
