import { Link } from 'react-router-dom';
import { PublicProductResponse } from '../../types/product.types';

interface CustomerProductGridProps {
  products: PublicProductResponse[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount);
};

export const CustomerProductGrid = ({
  products,
}: CustomerProductGridProps): JSX.Element => {
  return (
    <div className="customer-product-grid">
      {products.map((product) => (
        <article className="customer-product-card" key={product.id}>
          <img
            alt={product.name}
            className="customer-product-image"
            src={product.imageUrl}
          />
          <div className="customer-product-body">
            <p className="product-label">Available Coupon</p>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="customer-product-footer">
              <strong>{formatCurrency(product.price)}</strong>
              <Link className="primary-button product-link-button" to={`/products/${product.id}`}>
                View Details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
