export type yearModel = Root2[]

export interface Root2 {
  yearData: YearDaum[]
  yearTotals: YearTotal[]
  catergoryTotals: CatergoryTotal[]
}

export interface YearDaum {
  _id: Id
  totalIncome: number
  totalExpense: number
  transactions: Transaction[]
}

export interface Id {
  year: number
  month: number
}

export interface Transaction {
  _id: string
  recordType: string
  category: string
  amount: number
  pv: string
  attachmentUrl: string
  createdBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface YearTotal {
  _id: Id2
  totalIncome: number
  totalExpense: number
  currentAmount: number
}

export interface Id2 {
  year: number
}

export interface CatergoryTotal {
  _id: Id3
  total: number
}

export interface Id3 {
  category: string
  year: number
}
