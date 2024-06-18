import ProductDto from "@/dto/productDto";

interface Variations {
  id: number;
  product_id: number;
  image_url: string;
  color_type: string;
  name: string;
  price: number;
  price_sale: number;
  amount: number;
  quantity: number;
  image: File;
}

interface ProductAdminDto {
  id: number;
  name: string;
  seo_keywords: string;
  slug: string;
  brand_id: number;
  category_id: number;
  show_hide: number;
  description: string;
  variations: Variations[];
  category: { id: number };
}

const convertToProductDtos = (
  productAdminDtos: ProductAdminDto[]
): ProductDto[] => {
  const productDtos: ProductDto[] = [];
  for (const productAdminDto of productAdminDtos) {
    for (const variation of productAdminDto.variations) {
      const productDto: ProductDto = {
        id: productAdminDto.id,
        variant_id: variation.id,
        name: productAdminDto.name,
        seo_keywords: productAdminDto.seo_keywords,
        category_id: productAdminDto.category.id,
        brand_id: productAdminDto.brand_id,
        status: true,
        image: variation.image_url,
        color: variation.color_type,
        price: variation.price,
        amount: variation.amount,
        show_hide: productAdminDto.show_hide,
        description: "",
      };
      productDtos.push(productDto);
    }
    if (productAdminDto.variations.length === 0) {
      const productDto: ProductDto = {
        id: productAdminDto.id,
        variant_id: 0,
        name: productAdminDto.name,
        seo_keywords: productAdminDto.seo_keywords,
        category_id: productAdminDto.category.id,
        brand_id: productAdminDto.brand_id,
        status: true,
        image: "",
        color: "",
        price: 0,
        amount: 0,
        show_hide: productAdminDto.show_hide,
        description: "",
      };
      productDtos.push(productDto);
    }
  }
  return productDtos;
};

export default ProductAdminDto;
export { Variations, convertToProductDtos };
