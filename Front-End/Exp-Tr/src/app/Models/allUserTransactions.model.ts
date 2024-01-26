export interface AllUserTransactions {
  transactions: Transaction[];
}
export interface Transaction {
  _id: string;
  recordType: string;
  amount: number;
  pv: string;
  category: string;
  description: string;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastEditedBy: string;
  attachmentUrl?: string;
}