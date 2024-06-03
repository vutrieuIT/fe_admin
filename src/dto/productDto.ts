interface ProductTypeDto {
  image: string;
  color: string;
  price: number;
  amout: number;
}

interface ProductDto {
  id: number;
  name: string;
  type: ProductTypeDto;
  status: boolean;
}

export default ProductDto;
export { ProductTypeDto };
