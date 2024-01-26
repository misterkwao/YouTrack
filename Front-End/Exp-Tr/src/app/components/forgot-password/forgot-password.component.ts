import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'highcharts';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  //variables
  showSpinnerL: boolean = false;
  showNotification: boolean = false;
  Response?: any;
  showforgot: boolean = true;
  showReset: boolean = false;
  showSidepanel: boolean = false;

  constructor(private router: Router,private http: HttpClient,private YoutrackService: YoutrackService){}

  sendLink(email: string): void{
    this.showSpinnerL = true
    this.YoutrackService.sendLink(email)
    .subscribe({
      next: (response)=>{
        this.Response = response.msg;
         if(this.Response === "A token has been sent to your email address"){
           this.showSpinnerL = false;
           this.showNotification = true;
           this.showSidepanel = true;// for mobile
           this.showforgot = false;
           setTimeout(()=>{
            this.showNotification = false;
            this.showSidepanel = false
            this.showReset = true
          }, 3000);
        }
      },
      error: (Response)=>{
        this.Response = Response.error.msg;
        this.showSpinnerL = false;
          this.showNotification = true;
          setTimeout(()=>{
           this.showNotification = false;
         }, 3000);
      }
     });
  }

  changePassword(token:string, password:string): void{
    this.showSpinnerL = true
    this.YoutrackService.changePassword(token, password)
    .subscribe({
      next: (response)=>{
         this.Response = response.msg;
         if(this.Response === "Password reset successful"){
           this.showSpinnerL = false;
           this.showNotification = true;
           setTimeout(()=>{
            this.showNotification = false;
            this.router.navigateByUrl('/')
          }, 3000);
        }
      },
      error: (Response)=>{
        this.Response = Response.error.msg;
        this.showSpinnerL = false;
          this.showNotification = true;
          setTimeout(()=>{
           this.showNotification = false;
         }, 3000);
      }
     });
  }

}
