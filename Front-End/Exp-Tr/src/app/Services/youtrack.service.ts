import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { adminModel, userModel } from '../Models/profile.model';
import { weekModel } from '../Models/userweekdata.model';
import { yearModel } from '../Models/useryeardata.model';
import { logInModel, createUserModel, forgotPasswordModel } from '../Models/auth.model';
import { muModel } from '../Models/manageusers.model';
import { AllUserTransactions } from '../Models/allUserTransactions.model';
import { allUsers } from '../Models/allusers.model';

@Injectable({
  providedIn: 'root'
})
export class YoutrackService {

  constructor(private http: HttpClient) { };

  signUp(username: string, email: string, pass: string,levelType:string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    switch(levelType){
       case "Level 1":
         return this.http.post("https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser",
         {
           name: username,
           email: email,
           password: pass,
           role: "level 1",
           permissions :["create","update","delete"]
         },
         {'headers': headers}
         )
         default:
          return this.http.post("https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser",
          {
            name: username,
            email: email,
            password: pass,
            role:"level 2",
            permissions:["create","update","delete","eur"]
          },
          {'headers': headers}
          )
    }
  }

  editUserPermissions(profileID:string,levelType: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    switch(levelType){
       case "Level 1":
         return this.http.patch(`https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser/${profileID}`,
         {
           role: "level 1",
           permissions :["create","update","delete"]
         },
         {'headers': headers}
         )
         case "Level 2":
          return this.http.patch(`https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser/${profileID}`,
          {
            role:"level 2",
            permissions:["create","update","delete","eur"]
          },
          {'headers': headers}
          )
        default:
          return this.http.patch(`https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser/${profileID}`,
          {
            role:"level 2",
            permissions:["create","update","delete"]
          },
          {'headers': headers}
          )
    }
  }

  logIn(email: string, password: string): Observable<logInModel>{
    return this.http.post<logInModel>("https://youtrack-hfl0.onrender.com/api/v1/auth/login",
    {
      email: email,
      password: password
    }
    )
}

logInAdmin(email: string, password: string): Observable<logInModel>{
  return this.http.post<logInModel>("https://youtrack-hfl0.onrender.com/api/v1/adminAuth/login",
  {
    email: email,
    password: password
  }
  )
}


  getUserProfile(): Observable<userModel>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<userModel>("https://youtrack-hfl0.onrender.com/api/v1/user",{'headers': headers});
  };

  getAdminProfile(): Observable<adminModel>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<adminModel>("https://youtrack-hfl0.onrender.com/api/v1/admin",{'headers': headers});
  }
   
  updateUserProfile(updateType: string,updateValue: any){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    switch(updateType){
      case 'profilePic':
        const formData = new FormData();
        formData.append('profilePictureURL', updateValue)//field and value
       return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",formData,{'headers': headers});
      case 'username':
       return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",{user:updateValue},{'headers': headers});
     case 'category':
      return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",{userCategory:updateValue},{'headers': headers});
     case 'filterW':
      return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",{filterBy:updateValue},{'headers': headers});
     case 'filterY':
      return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",{filterBy:updateValue},{'headers': headers});
     default:
      return this.http.patch("https://youtrack-hfl0.onrender.com/api/v1/user",{currencyType:updateValue},{'headers': headers})
  }
  }

  deleteUser(id:string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
   return this.http.delete(`https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser/${id}`,{'headers': headers});
  }
  
  addorupdate(description: string,category:any,attachmentUrl:any,pv:string,amount: any,record: string,addorupdate:boolean,recordID:any){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    const formData = new FormData();
    if(addorupdate){
      //creating a new record
      formData.append('attachmentUrl',attachmentUrl)
      formData.append('recordType',record);
      formData.append('amount',amount)
      formData.append('pv',pv)
      formData.append('category',category);
      formData.append('description',description);
      return this.http.post("https://youtrack-hfl0.onrender.com/api/v1/user/data/records",formData,{'headers':headers});

    }
    else{
      //updating the record
      if(attachmentUrl != undefined){
        formData.append('attachmentUrl',attachmentUrl)
      }
      if(record){
        formData.append('recordType',record);
      }
      if(amount){
        formData.append('amount',amount)
      }
      if(pv){
        formData.append('pv',pv)
      }
      if(category){
        formData.append('category',category);
      }
      if(description){
        formData.append('description',description);
      }
      
      return this.http.patch(`https://youtrack-hfl0.onrender.com/api/v1/user/data/records/${recordID}`,formData,{'headers':headers});
      
    }
  }

  updateUserRecord(description: string,category:any,attachmentUrl:any,pv:string,amount: any,record: string,recordID:any){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    const formData = new FormData();
    
      //updating the record
      if(attachmentUrl != undefined){
        formData.append('attachmentUrl',attachmentUrl)
      }
      if(record){
        formData.append('recordType',record);
      }
      if(amount){
        formData.append('amount',amount)
      }
      if(pv){
        formData.append('pv',pv)
      }
      if(category){
        formData.append('category',category);
      }
      if(description){
        formData.append('description',description);
      }
      return this.http.patch(`https://youtrack-hfl0.onrender.com/api/v1/user/manageUsers/records/${recordID}`,formData,{'headers':headers});
  

  }

  deleteRecord(id: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
       return this.http.delete(`https://youtrack-hfl0.onrender.com/api/v1/user/data/records/${id}`,{'headers':headers})
  }

  getYearData(): Observable<yearModel>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<yearModel>("https://youtrack-hfl0.onrender.com/api/v1/user/data?filterBy=year",{'headers':headers});
  }

  getWeekData(): Observable<weekModel>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<weekModel>("https://youtrack-hfl0.onrender.com/api/v1/user/data?filterBy=week",{'headers':headers});
  }

  getManageUsersStats(): Observable<muModel>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<muModel>("https://youtrack-hfl0.onrender.com/api/v1/user/manageUsers",{'headers':headers});
  }

  getAllUserTransactions(): Observable<AllUserTransactions>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<AllUserTransactions>("https://youtrack-hfl0.onrender.com/api/v1/user/manageUsers/records",{'headers':headers});
  }

  getAllUsers(): Observable<allUsers>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`);
    return this.http.get<allUsers>("https://youtrack-hfl0.onrender.com/api/v1/admin/manageuser",{'headers':headers});
  }

  sendLink(email:string): Observable<forgotPasswordModel>{
    return this.http.post<forgotPasswordModel>("https://youtrack-hfl0.onrender.com/api/v1/auth/forgotPassword", {
      email: email
    })
  }

  changePassword(token:string, password:string): Observable<forgotPasswordModel>{
    return this.http.patch<forgotPasswordModel>(`https://youtrack-hfl0.onrender.com/api/v1/auth/resetPassword/${token}`, {
      password: password
    })
  }

}
