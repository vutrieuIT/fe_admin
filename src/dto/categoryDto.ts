interface CategoryDto {
  id: number;
  created_at: string;
  name: string;
  parent_id: number;
  slug: string;
  status: string;
}

export default CategoryDto;
