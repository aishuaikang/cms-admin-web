export interface Dict {
  id: string;
  name: string;
  code: string;
  extra: string;
  description: string;
  parentId: string | null;
  imageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AddDictParams = Omit<Dict, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateDictParams = Partial<Omit<AddDictParams, 'parentId'>> & {
  id: Dict['id'];
};
