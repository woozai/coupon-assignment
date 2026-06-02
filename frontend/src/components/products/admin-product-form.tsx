import { FormEvent, useState } from 'react';
import {
  CouponValueType,
  CreateCouponRequest,
} from '../../types/product.types';

interface AdminProductFormProps {
  isSubmitting: boolean;
  onCreateProduct: (productInput: CreateCouponRequest) => Promise<void>;
}

interface ProductFormValues {
  costPrice: string;
  description: string;
  imageUrl: string;
  marginPercentage: string;
  name: string;
  value: string;
  valueType: CouponValueType;
}

const initialFormValues: ProductFormValues = {
  costPrice: '80',
  description: '',
  imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  marginPercentage: '25',
  name: '',
  value: '',
  valueType: 'STRING',
};

const getCouponValueLabel = (valueType: CouponValueType): string => {
  return valueType === 'IMAGE' ? 'Coupon Image URL' : 'Coupon Value';
};

const getCouponValuePlaceholder = (valueType: CouponValueType): string => {
  return valueType === 'IMAGE'
    ? 'https://example.com/redeem-image.png'
    : 'STEAM-CODE-123';
};

const getCouponValueInputType = (valueType: CouponValueType): 'text' | 'url' => {
  return valueType === 'IMAGE' ? 'url' : 'text';
};

export const AdminProductForm = ({
  isSubmitting,
  onCreateProduct,
}: AdminProductFormProps): JSX.Element => {
  const [formValues, setFormValues] = useState<ProductFormValues>(initialFormValues);
  const couponValueLabel = getCouponValueLabel(formValues.valueType);
  const couponValuePlaceholder = getCouponValuePlaceholder(formValues.valueType);
  const couponValueInputType = getCouponValueInputType(formValues.valueType);

  const updateFormValue = (
    field: keyof ProductFormValues,
    nextValue: string,
  ): void => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await onCreateProduct({
      costPrice: Number(formValues.costPrice),
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      marginPercentage: Number(formValues.marginPercentage),
      name: formValues.name,
      value: formValues.value,
      valueType: formValues.valueType,
    });

    setFormValues((currentValues) => ({
      ...initialFormValues,
      costPrice: currentValues.costPrice,
      imageUrl: currentValues.imageUrl,
      marginPercentage: currentValues.marginPercentage,
      valueType: currentValues.valueType,
    }));
  };

  return (
    <section className="page-card admin-panel">
      <p className="eyebrow">Create Coupon</p>
      <h2>Add a new coupon record</h2>
      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label className="field-group field-group-half">
          <span>Name</span>
          <input
            className="field-input"
            onChange={(event) => updateFormValue('name', event.target.value)}
            placeholder="Steam Wallet 100"
            required
            value={formValues.name}
          />
        </label>
        <label className="field-group field-group-half">
          <span>Image URL</span>
          <input
            className="field-input"
            onChange={(event) => updateFormValue('imageUrl', event.target.value)}
            required
            type="url"
            value={formValues.imageUrl}
          />
        </label>
        <label className="field-group field-group-full">
          <span>Description</span>
          <textarea
            className="field-input field-textarea"
            onChange={(event) => updateFormValue('description', event.target.value)}
            placeholder="Fast-delivery gaming wallet coupon."
            required
            value={formValues.description}
          />
        </label>
        <label className="field-group field-group-half">
          <span>Value Type</span>
          <select
            className="field-input"
            onChange={(event) =>
              updateFormValue('valueType', event.target.value as CouponValueType)
            }
            value={formValues.valueType}
          >
            <option value="STRING">String</option>
            <option value="IMAGE">Image</option>
          </select>
        </label>
        <label className="field-group field-group-half">
          <span>{couponValueLabel}</span>
          <input
            className="field-input"
            onChange={(event) => updateFormValue('value', event.target.value)}
            placeholder={couponValuePlaceholder}
            required
            type={couponValueInputType}
            value={formValues.value}
          />
          <small className="field-help">
            {formValues.valueType === 'IMAGE'
              ? 'Paste the URL of the image customers should receive after purchase.'
              : 'Enter the text code or redeemable string customers should receive after purchase.'}
          </small>
        </label>
        <label className="field-group field-group-half">
          <span>Cost Price</span>
          <input
            className="field-input"
            min="0"
            onChange={(event) => updateFormValue('costPrice', event.target.value)}
            required
            step="0.01"
            type="number"
            value={formValues.costPrice}
          />
        </label>
        <label className="field-group field-group-half">
          <span>Margin Percentage</span>
          <input
            className="field-input"
            min="0"
            onChange={(event) =>
              updateFormValue('marginPercentage', event.target.value)
            }
            required
            step="0.01"
            type="number"
            value={formValues.marginPercentage}
          />
        </label>
        <div className="form-actions form-actions-full">
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </section>
  );
};
