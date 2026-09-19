export type ItemType = 'LOST' | 'FOUND';
export type ItemCategory = 'Electronics' | 'Keys' | 'Wallets & Cards' | 'Pets' | 'Clothing' | 'Documents' | 'Jewelry' | 'Other';
export type ItemStatus = 'ACTIVE' | 'RESOLVED';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IItem {
  _id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: ItemType;
  images: string[];
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
