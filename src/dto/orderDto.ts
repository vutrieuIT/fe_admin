interface OrderDto {
  id: string;
  user: string;
  total: number;
  status: string;
  createDate: Date;
}

export default OrderDto;
