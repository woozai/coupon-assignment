import { CouponValueType } from '../../types/product.types';

interface CouponValueDisplayProps {
  productName: string;
  value: string;
  valueType: CouponValueType;
}

export const CouponValueDisplay = ({
  productName,
  value,
  valueType,
}: CouponValueDisplayProps): JSX.Element => {
  if (valueType === 'IMAGE') {
    return (
      <div className="coupon-value-image-shell">
        <img
          alt={`${productName} coupon value`}
          className="coupon-value-image"
          src={value}
        />
      </div>
    );
  }

  return <strong className="coupon-value-text">{value}</strong>;
};
