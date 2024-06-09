interface OrderDto {
  id: string;
  order_number: string;
  full_name: string;
  user: string;
  total: number;
  status: string;
  date_create: Date;
}

export default OrderDto;
