import { useEffect, useState } from 'react';
import { adminProductsService } from '../services/admin-products.service';
import {
  AdminProductResponse,
  CreateCouponRequest,
} from '../types/product.types';

interface UseAdminProductsResult {
  createProduct: (productInput: CreateCouponRequest) => Promise<void>;
  errorMessage: string | null;
  isCreating: boolean;
  isLoading: boolean;
  products: AdminProductResponse[];
}

export const useAdminProducts = (
  accessToken: string | null,
): UseAdminProductsResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<AdminProductResponse[]>([]);

  useEffect(() => {
    if (!accessToken) {
      setProducts([]);
      setErrorMessage(null);
      return;
    }

    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextProducts = await adminProductsService.listProducts(accessToken);

        setProducts(nextProducts);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load admin products.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [accessToken]);

  const createProduct = async (productInput: CreateCouponRequest): Promise<void> => {
    if (!accessToken) {
      throw new Error('Admin token is missing.');
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const createdProduct = await adminProductsService.createProduct(
        accessToken,
        productInput,
      );

      // Prepend the created record so the list reflects the write without another fetch.
      setProducts((currentProducts) => [createdProduct, ...currentProducts]);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create product.',
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createProduct,
    errorMessage,
    isCreating,
    isLoading,
    products,
  };
};
