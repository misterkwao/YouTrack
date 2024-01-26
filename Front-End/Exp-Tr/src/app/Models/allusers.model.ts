export interface allUsers {
    admins: Admin[]
    users: User[]
    adminTotal: number
    userTotal: number
  }
  
  export interface Admin {
    _id: string
    admin: string
    profilePictureURL: string
    adminCategory: string[]
    currencyType: string
    filterBy: string
    createdBy: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface User {
    _id: string
    user: string
    profilePictureURL: string
    userCategory: string[]
    currencyType: string
    filterBy: string
    role: string
    permissions: string[]
    owner: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  