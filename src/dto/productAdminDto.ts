interface ProductAdminDto {
  id: string;
  name: string;
  brandName: string;
  description: string;
  isShow: boolean;
  status: number;
  ram: number;
  operatingSystem: string;
  mainCamera: number;
  selfieCamera: number;
  batterySize: number;
  screenSize: number;
  weight: number;
  specifications: Specification[];
  variants: Variant[];
}

interface Specification {
  internalMemory: number;
  price: number;
  color: string[];
}

interface Variant {
  color: string;
  quantity: number;
  images: string[];
}

export default ProductAdminDto;
export { Specification, Variant };
