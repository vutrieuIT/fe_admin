interface DiscountDto {
  id: string | null;
  code: string | null;
  discount: number | null;
  discountType: string | null;
  status: string | null;
  startDate: Date | null;
  endDate: Date | null;
  employeeId: string | null;
}

export default DiscountDto;
