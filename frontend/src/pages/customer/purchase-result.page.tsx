import { Link, useLocation } from 'react-router-dom';
import '../../styles/admin-products.css';
import '../../styles/customer-products.css';
import { PurchaseResultRouteState } from '../../types/product.types';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount);
};

export const PurchaseResultPage = (): JSX.Element => {
  const location = useLocation();
  const routeState = location.state as PurchaseResultRouteState | null;

  if (!routeState) {
    return (
      <section className="page-card purchase-result-panel">
        <p className="eyebrow">Purchase Result</p>
        <h2>No completed purchase found</h2>
        <p className="purchase-result-copy">
          Complete a purchase from the coupon details page to view the redeemed value here.
        </p>
        <div className="form-actions">
          <Link className="primary-button product-link-button" to="/">
            Back to Coupons
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card purchase-result-panel">
      <p className="eyebrow">Purchase Complete</p>
      <h2>{routeState.productName}</h2>
      <p className="purchase-result-copy">
        The coupon value is shown below because the backend confirmed the sale successfully.
      </p>
      <div className="purchase-result-banner">
        <span className="result-badge">DONE</span>
        <div>
          <strong>{routeState.purchaseResult.value}</strong>
          <p className="purchase-result-copy">
            Value type: {routeState.purchaseResult.valueType}
          </p>
        </div>
      </div>
      <dl className="purchase-metadata">
        <div>
          <dt>Final Price</dt>
          <dd>{formatCurrency(routeState.purchaseResult.finalPrice)}</dd>
        </div>
        <div>
          <dt>Product Id</dt>
          <dd>{routeState.purchaseResult.productId}</dd>
        </div>
      </dl>
      <div className="form-actions">
        <Link className="primary-button product-link-button" to="/">
          Browse More Coupons
        </Link>
      </div>
    </section>
  );
};
