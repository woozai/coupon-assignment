import { AdminProductResponse } from '../../types/product.types';

interface AdminProductListProps {
  isLoading: boolean;
  products: AdminProductResponse[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount);
};

export const AdminProductList = ({
  isLoading,
  products,
}: AdminProductListProps): JSX.Element => {
  if (isLoading) {
    return (
      <section className="page-card admin-panel">
        <p className="eyebrow">Inventory</p>
        <h2>Current coupon records</h2>
        <p className="admin-copy">Loading admin products...</p>
      </section>
    );
  }

  return (
    <section className="page-card admin-panel">
      <div className="admin-list-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Current coupon records</h2>
        </div>
        <span className="inventory-count">{products.length} items</span>
      </div>
      {products.length === 0 ? (
        <p className="admin-copy">
          No coupons yet. Create the first record to populate the admin list.
        </p>
      ) : (
        <div className="admin-product-grid">
          {products.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-top">
                <div>
                  <p className="product-label">{product.type}</p>
                  <h3>{product.name}</h3>
                </div>
                <span
                  className={
                    product.isSold ? 'inventory-badge inventory-badge-sold' : 'inventory-badge'
                  }
                >
                  {product.isSold ? 'Sold' : 'Available'}
                </span>
              </div>
              <p>{product.description}</p>
              <dl className="inventory-metadata">
                <div>
                  <dt>Cost</dt>
                  <dd>{formatCurrency(product.costPrice)}</dd>
                </div>
                <div>
                  <dt>Margin</dt>
                  <dd>{product.marginPercentage}%</dd>
                </div>
                <div>
                  <dt>Minimum Sell</dt>
                  <dd>{formatCurrency(product.minimumSellPrice)}</dd>
                </div>
                <div>
                  <dt>Value Type</dt>
                  <dd>{product.valueType}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
