export type ItemStatus = "active" | "recovered" | "closed";
export type ProofStatus = "pending" | "accepted" | "rejected";

export interface IUser {
  _id: string;
  userName: string;
  email: string;
}

export interface ICategory {
  _id: string;
  name: string;
  description?: string;
}

export interface IItem {
  _id: string;
  userId: string;
  categoryId: string | ICategory;
  title: string;
  description: string;
  lostDate: string;
  location: { address: string };
  images: string[];
  privateDetails: string | null;
  question: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IProof {
  _id: string;
  itemId: string;
  holderId: string;
  askerId: string;
  question: string;
  answer: string;
  status: ProofStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IAiMatch {
  id: string;
  score: number;
  item?: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
  };
}

export interface IAiMatchResult {
  matchFound: boolean;
  matches: IAiMatch[];
  queryUsed: string;
  error?: string;
}

export interface ISearchResponse {
  success: boolean;
  count: number;
  data: IItem[];
  aiMatch?: IAiMatchResult;
  message?: string;
}
