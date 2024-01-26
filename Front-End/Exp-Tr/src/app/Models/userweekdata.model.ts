export type weekModel = Root2[]

export interface Root2 {
  weekData: WeekDaum[]
  weekTotals: WeekTotal[]
  catergoryTotals: CatergoryTotal[]
}

export interface WeekDaum {
  _id: Id
  income: number
  expense: number
  transactions: Transaction[]
}

export interface Id {
  year: number
  month: number
  week: number
  day: number
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

export interface WeekTotal {
  _id: Id2
  totalIncome: number
  totalExpense: number
  currentAmount: number
}

export interface Id2 {
  year: number
  month: number
  week: number
}

export interface CatergoryTotal {
  _id: Id3
  total: number
}

export interface Id3 {
  category: string
  year: number
  month: number
  week: number
}
