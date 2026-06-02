import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerProductsService } from '../../services/customer-products.service';
import '../../styles/admin-products.css';
import '../../styles/customer-products.css';
import {
  PublicProductResponse,
  PurchaseResultRouteState,
} from '../../types/product.types';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount);
};

export const CustomerProductDetailsPage = (): JSX.Element => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [product, setProduct] = useState<PublicProductResponse | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const loadProduct = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextProduct = await customerProductsService.getProductById(productId);

        setProduct(nextProduct);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load product details.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId]);

  const handlePurchaseSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!productId || !product) {
      return;
    }

    setIsPurchasing(true);
    setErrorMessage(null);

    try {
      const purchaseResult = await customerProductsService.purchaseProduct(productId);

      navigate('/purchase-result', {
        state: {
          productName: product.name,
          purchaseResult,
        } satisfies PurchaseResultRouteState,
      });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to complete purchase.',
      );
    } finally {
      setIsPurchasing(false);
      }
  };

  if (isLoading) {
    return (
      <section className="page-card customer-panel">
        <p className="customer-copy">Loading coupon details...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-card customer-panel">
        <p className="eyebrow">Coupon Details</p>
        <h2>Product unavailable</h2>
        <p className="customer-copy">
          {errorMessage ?? 'The requested coupon could not be loaded.'}
        </p>
      </section>
    );
  }

  return (
    <div className="details-layout">
      <article className="details-panel">
        <img alt={product.name} className="details-image" src={product.imageUrl} />
        <div className="details-body">
          <p className="eyebrow">Coupon Details</p>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <dl className="purchase-metadata">
            <div>
              <dt>Minimum Price</dt>
              <dd>{formatCurrency(product.price)}</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>Public fields only</dd>
            </div>
          </dl>
        </div>
      </article>
      <section className="page-card customer-panel details-sidebar">
        <div>
          <p className="eyebrow">Purchase Flow</p>
          <h2>Complete your purchase</h2>
        </div>
        <p className="customer-copy">
          The displayed price comes from the backend, and the coupon value is revealed only after a successful purchase.
        </p>
        <form className="purchase-form" onSubmit={handlePurchaseSubmit}>
          <div className="page-card purchase-price-card">
            <p className="product-label">Checkout Price</p>
            <strong>{formatCurrency(product.price)}</strong>
          </div>
          <div className="form-actions">
            <button className="primary-button" disabled={isPurchasing} type="submit">
              {isPurchasing ? 'Purchasing...' : 'Purchase Coupon'}
            </button>
          </div>
        </form>
        {errorMessage ? <p className="feedback-error">{errorMessage}</p> : null}
      </section>
    </div>
  );
};
