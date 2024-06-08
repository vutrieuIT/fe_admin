interface CategoryDto {
  id: number;
  created_at: string;
  name: string;
  show_hide: boolean;
  position: number;
  parent_id: number;
  slug: string;
  status: string;
}

export default CategoryDto;
