export interface ProductItem {
  id: string;
  name: string;
  variant: string; // e.g., Color, Mesh Size
  quantity: number; // Number of rolls
}

export interface SalesOrder {
  orderId: string;
  customerName: string;
  gstNumber?: string;
  customerAddress: string;
  orderDate: string;
  products: ProductItem[];
}

// Represents a specific roll's data in the packing slip
export interface RollEntry {
  productId: string;
  productName: string;
  variant: string;
  rollNumber: number; // 1 of 13, 2 of 13, etc.
  weight: string; // Input by user
}

export enum AppView {
  SALES_ORDER = 'SALES_ORDER',
  PACKING_SLIP = 'PACKING_SLIP'
}