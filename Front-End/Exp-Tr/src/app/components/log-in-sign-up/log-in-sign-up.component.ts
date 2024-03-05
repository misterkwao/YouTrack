import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-log-in-sign-up',
  templateUrl: './log-in-sign-up.component.html',
  styleUrls: ['./log-in-sign-up.component.css']
})
export class LogInSignUpComponent{

  //Variables
  showSpinnerL: boolean = false;
  showSpinnerS: boolean = false;
  removeNotify: boolean = false;
  response?: any;
  formvalue: boolean = false;
  // showLogin: boolean = true;
  // showSignUp: boolean = false;

  constructor(private router: Router,private http: HttpClient,private YoutrackService: YoutrackService){}

  logIn(email: string, password: string): void{
    this.showSpinnerL = true
    this.YoutrackService.logIn(email,password)
    .subscribe({
      next: (response)=>{
         this.response = response;
         if(this.response.msg === "Invalid Credentials"){
           this.showSpinnerL = false;
           setTimeout(()=>{
            this.response.msg = "";
          }, 1500);
        }
        else{
           sessionStorage.setItem("token",this.response.token);
           setTimeout(()=>{
             this.router.navigateByUrl('/user/dashboard')
           }, 1200);
         }
      }
     });
  }

  AdminLogIn(email: string, password: string): void {
    this.showSpinnerS = true
    this.YoutrackService.logInAdmin(email,password)
    .subscribe({
      next: (response)=>{
         this.response = response;
         if(this.response.msg === "Invalid Credentials"){
           this.showSpinnerS = false;
           setTimeout(()=>{
            this.response.msg = "";
          }, 1500);
        }
        else{
           sessionStorage.setItem("token",this.response.token);
           setTimeout(()=>{
             this.router.navigateByUrl('/admin/dashboard')
           }, 1200);
         }
      }
     });
  }

  changeFormType(): void{
    if(this.formvalue){
      this.formvalue = false;
    }
    else{
      this.formvalue = true;
    }
  }

}
