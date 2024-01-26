export interface muModel {
    users: User[]
    totalAmounts: TotalAmounts
    categories: Category[]
  }
  
  export interface User {
    name: string
    profilePictureURL: string
    currencyType: string
    totalIncome: number
    totalExpense: number
    currentAmount: number
  }
  
  export interface TotalAmounts {
    _id: Id
    totalIncome: number
    totalExpense: number
    currentAmount: number
  }
  
  export interface Id {
    year: number
  }
  
  export interface Category {
    _id: Id2
    totalAmt: number
  }
  
  export interface Id2 {
    year: number
    category: string
  }
  