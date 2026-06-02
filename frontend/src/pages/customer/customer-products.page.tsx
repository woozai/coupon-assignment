import { useEffect, useState } from 'react';
import { CustomerProductGrid } from '../../components/products/customer-product-grid';
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
        {errorMessage ? <p className="feedback-error">{errorMessage}</p> : null}
      </section>
      {isLoading ? (
        <section className="page-card customer-panel">
          <p className="customer-copy">Loading available coupons...</p>
        </section>
      ) : null}
      {!isLoading && products.length === 0 ? (
        <section className="page-card customer-panel">
          <p className="customer-copy">No coupons are available right now.</p>
        </section>
      ) : null}
      {!isLoading && products.length > 0 ? (
        <CustomerProductGrid products={products} />
      ) : null}
    </div>
  );
};
