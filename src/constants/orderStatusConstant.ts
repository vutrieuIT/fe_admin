const ORDER_STATUS_CONSTANT = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Đã giao hàng",
  CANCELED: "Đã hủy",
} as const;

export default ORDER_STATUS_CONSTANT;
