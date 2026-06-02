import { AdminLoginPanel } from '../../components/products/admin-login-panel';
import { AdminProductForm } from '../../components/products/admin-product-form';
import { AdminProductList } from '../../components/products/admin-product-list';
import { useAdminProducts } from '../../hooks/use-admin-products';
import { useAdminSession } from '../../hooks/use-admin-session';
import '../../styles/admin-products.css';

export const AdminProductsPage = (): JSX.Element => {
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

  if (!accessToken) {
    return (
      <AdminLoginPanel
        errorMessage={sessionErrorMessage}
        isSubmitting={isSubmitting}
        onLogin={login}
      />
    );
  }

  return (
    <div className="admin-layout">
      <section className="page-card admin-panel">
        <div className="admin-list-heading">
          <div>
            <p className="eyebrow">Admin Workspace</p>
            <h2>Inventory command center</h2>
          </div>
          <button className="primary-button" onClick={logout} type="button">
            Sign Out
          </button>
        </div>
        <p className="admin-copy">
          You are authenticated and ready to create inventory records and review
          the current coupon catalog.
        </p>
        {productsErrorMessage ? (
          <p className="feedback-error">{productsErrorMessage}</p>
        ) : null}
      </section>
      <AdminProductForm
        isSubmitting={isCreating}
        onCreateProduct={createProduct}
      />
      <AdminProductList isLoading={isLoading} products={products} />
    </div>
  );
};
