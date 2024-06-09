interface ProductDto {
  id: number;
  variant_id: number;
  name: string;
  seo_keywords: string;
  category_id: number;
  brand_id: number;
  status: boolean;
  image: string;
  color: string;
  price: number;
  amount: number;
  show_hide: number;
  description: string;
}

export default ProductDto;
