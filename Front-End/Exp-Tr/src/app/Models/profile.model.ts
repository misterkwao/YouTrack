export interface userModel {
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

  export interface adminModel {
    _id: string
    admin: string
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
  