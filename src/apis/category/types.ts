export interface Category {
  id: string;
  name: string;
  alias: string;
  sort: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type AddCategoryParams = Pick<Category, 'name' | 'description'>;

export type UpdateCategoryParams = Partial<AddCategoryParams> & {
  id: Category['id'];
};
