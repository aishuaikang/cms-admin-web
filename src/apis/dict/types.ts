export interface Dict {
  id: string;
  name: string;
  code: string;
  extra: string;
  description: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export type AddDictParams = Omit<Dict, 'id' | 'created_at' | 'updated_at'>;

export type UpdateDictParams = Partial<Omit<AddDictParams, 'parent_id'>> & {
  id: Dict['id'];
};
