import { useEffect, useState } from 'react';
import { CustomerProductGrid } from '../../components/products/customer-product-grid';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorState } from '../../components/ui/error-state';
import { LoadingState } from '../../components/ui/loading-state';
import { customerProductsService } from '../../services/customer-products.service';
import '../../styles/admin-products.css';
import '../../styles/customer-products.css';
import { PublicProductResponse } from '../../types/product.types';

export const CustomerProductsPage = (): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<PublicProductResponse[]>([]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextProducts = await customerProductsService.listProducts();

        setProducts(nextProducts);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load available products.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <div className="customer-layout">
      <section className="page-card customer-panel">
        <p className="eyebrow">Storefront</p>
        <h2>Available coupons</h2>
        <p className="customer-copy">
          Browse active coupon inventory and continue straight to checkout from the frontend.
        </p>
      </section>
      {errorMessage ? (
        <ErrorState
          message={errorMessage}
          title="Unable to load coupons"
        />
      ) : null}
      {isLoading ? (
        <LoadingState
          message="Loading available coupons..."
          title="Available coupons"
        />
      ) : null}
      {!isLoading && !errorMessage && products.length === 0 ? (
        <EmptyState
          message="No coupons are available right now."
          title="No coupons available"
        />
      ) : null}
      {!isLoading && products.length > 0 ? (
        <CustomerProductGrid products={products} />
      ) : null}
    </div>
  );
};
