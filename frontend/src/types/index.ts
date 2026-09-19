export type ItemType = 'LOST' | 'FOUND';
export type ItemCategory = 'Electronics' | 'Keys' | 'Wallets & Cards' | 'Pets' | 'Clothing' | 'Documents' | 'Jewelry' | 'Other';
export type ItemStatus = 'ACTIVE' | 'RESOLVED';

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: ItemType;
  location: string;
  date: string;
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  status: ItemStatus;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMatchResult {
  item: IItem;
  score: number;
  reasons: string[];
}
