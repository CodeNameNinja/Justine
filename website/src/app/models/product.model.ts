export interface Product {
  id: string;
  title: string;
  description: string;
  amount: number;
  discount?: number;
  category: string;
  sizes: any;
  imageUrls: string[];
}
