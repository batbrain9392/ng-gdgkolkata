export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  fileUrl?: FileUrl;
}

export interface FileUrl {
  original: string;
  medium: string;
  small: string;
}
