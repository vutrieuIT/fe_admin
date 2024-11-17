interface OrderDto {
  id: string;
  order_number: string;
  full_name: string;
  userId: string;
  total: number;
  totalWeight: number;
  status: string;
  paymentStatus: string;
  paymentType: string;
  shippingOrderId: string;
  shippingOrderStatus: string;
  toAddress: string;
  addressCode: string[3];
  note: string;
  totalBill: number;
  createdAt: Date;
}

export default OrderDto;
