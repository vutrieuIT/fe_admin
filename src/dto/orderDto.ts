interface OrderDto {
  id: string;
  order_number: string;
  full_name: string;
  userId: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentType: string;
  date_create: Date;
}

export default OrderDto;
