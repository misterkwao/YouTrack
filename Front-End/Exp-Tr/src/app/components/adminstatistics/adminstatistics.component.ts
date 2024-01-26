import { AfterViewInit, Component } from '@angular/core';
import { allUsers } from 'src/app/Models/allusers.model';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-adminstatistics',
  templateUrl: './adminstatistics.component.html',
  styleUrls: ['./adminstatistics.component.css']
})
export class AdminstatisticsComponent implements AfterViewInit {

  constructor(private YouTrackService: YoutrackService){}

  //Variables
  allUsersData?: allUsers;
  searchValue?: any ;
  showSpinner: boolean = false;
 removeNotify: boolean = false;
  showFormValue: boolean = false;
  showEditUserFormValue: boolean = false;
  recordResponse?: any
  usersArray?: any[]=[];
  showPromptValue: boolean = true;
  userID: string ="";
  username?: string;
  profileID: string="";
  editResponse?: any;

  ngAfterViewInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void{
     this.YouTrackService.getAllUsers()
     .subscribe({
      next:(response)=>{
        this.allUsersData = response;
        this.usersArray = this.allUsersData.users;
        this.usersArray.reverse()
      }
     })
  }

  createUser(username:string, email:string, password:string, level:string): void{
    this.showSpinner = true;
    this.YouTrackService.signUp(username, email, password, level)
    .subscribe({
      next: (response)=>{
        this.recordResponse = response;
      }
    })
    setTimeout(()=>{
      if(this.recordResponse.msg === "User created"){
        this.showSpinner = false;
        this.removeNotify = true;
      }
      else{
        this.showSpinner = false;
        this.removeNotify = true;
      }
    }, 2000);
    this.recordResponse ="";
    this.removeNotify = false;
    this.getAllUsers();
  }

  editUser(level:string): void{
    this.showSpinner = true;
    this.YouTrackService.editUserPermissions(this.profileID, level)
    .subscribe({
      next: (response)=>{
          this.editResponse = response;
      }
    })
    setTimeout(()=>{
      if(this.editResponse.msg === "Edit successful"){
        this.showSpinner = false;
        this.removeNotify = true;
      }
      else{
        this.showSpinner = false;
        this.removeNotify = true;
      }
    }, 2000);
    this.editResponse ="";
    this.removeNotify = false;
    this.getAllUsers();
  }

  showeditUserForm(id:string): void{
      //displaying values
      this.allUsersData?.users.filter((value:any,index:number)=>{
        if(this.allUsersData?.users[index].owner === id){
          this.username = this.allUsersData?.users[index].user;
          this.profileID = this.allUsersData?.users[index]._id;
        }
  })
  //end
      this.showEditUserFormValue = true;
  }
  closeEditUserForm(): void{
    this.showEditUserFormValue = false;
  }

  deleteUser(){
    this.YouTrackService.deleteUser(this.userID)
    .subscribe({
      next: (response)=>{
        this.getAllUsers();
        this.showPromptValue = true
      }
    })
  }

  showForm(): void{
     if(!this.showFormValue){
         this.showFormValue = true;
     }
     else{
      this.showFormValue = false
      this.getAllUsers();
     }
  }

  showPrompt(id:string): void{
    this.userID = id;
    if(this.showPromptValue){
      this.showPromptValue = false;
  }
  else{
   this.showPromptValue = true
  }
  }

  closePrompt(): void{
    if(this.showPromptValue){
      this.showPromptValue = false;
  }
  else{
   this.showPromptValue = true
  }
  }


}
