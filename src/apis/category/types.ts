export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type AddCategoryParams = Pick<Category, 'name' | 'description'>;

export type UpdateCategoryParams = Partial<AddCategoryParams> & {
  id: Category['id'];
};
