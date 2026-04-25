export interface Product {
  id: string | number;
  name: string;
  sku?: string;
  size: string;
  details: string;
  image: string;
  unit: string;
  price?: number;
  is_available?: boolean;
}

export interface DatabaseProduct extends Omit<Product, 'image'> {
  image_url: string;
}


export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Quotation {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  business_type?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
  items?: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_id: string;
  quantity: number;
  products?: Partial<Product>;
}
