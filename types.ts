
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface PurchaseEvent {
  name:string;
  location: string;
  productName: string;
  timestamp: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
