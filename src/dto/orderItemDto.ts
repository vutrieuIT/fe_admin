interface OrderItemDto {
  id: string;
  image_url: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export default OrderItemDto;
