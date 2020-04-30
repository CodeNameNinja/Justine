export interface Product {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  sizes: {
    small: number,
    medium: number,
    large: number,
    xLarge: number,
  };
  imageUrls: string[];
}
