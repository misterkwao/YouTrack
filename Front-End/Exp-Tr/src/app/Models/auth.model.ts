export interface createUserModel {
    name: string
    email: string
    password: string
    role: string
    permissions: string[]
  }

  export interface logInModel {
    name: string
    email: string
    password: string
  }

  export interface forgotPasswordModel {
    msg: string
  }