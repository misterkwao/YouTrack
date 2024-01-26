import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { YoutrackService } from 'src/app/Services/youtrack.service';
import { userModel } from 'src/app/Models/profile.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent implements AfterViewInit{
  
  //Variables
  highlightStatsBtn: boolean =  true;
  highlightSettingsBtn: boolean = false;
  highlightTransacBtn: boolean = false;
  highlightUserBtn: boolean = false;
  showMenuValue: boolean = false;
  userProfileData?: userModel;
 
constructor(private router: Router,private YoutrackService: YoutrackService){}

  ngAfterViewInit(): void {
    this.getuserProfileData();
  }
 
private getuserProfileData(){
  this.YoutrackService.getUserProfile()
  .subscribe({
    next: (response)=>{
     this.userProfileData = response;
     sessionStorage.setItem("role", this.userProfileData.role)
     //console.log(this.userProfileData)
    }
  })
}


showMenu(): void{
  if(!(this.showMenuValue)){
     this.showMenuValue = true;
  }
}
removeMenu(): void{
  if(this.showMenuValue){
    this.showMenuValue = false;
 }
}

//buttons
displayStats(): void {
    this.router.navigateByUrl('user/dashboard');
    //Highlighting the button clicked
    if(!this.highlightStatsBtn){
      this.highlightSettingsBtn = false;
      this.highlightTransacBtn = false;
      this.highlightUserBtn = false;
      this.highlightStatsBtn = true;
    }
    this.removeMenu();// for mobile devices
}
displayTransac(): void {
  this.router.navigateByUrl('user/transactions');
  //Highlighting the button clicked
  if(!this.highlightTransacBtn){
    this.highlightSettingsBtn = false;
    this.highlightStatsBtn = false;
    this.highlightUserBtn = false;
   this.highlightTransacBtn = true;
  }
  this.removeMenu();// for mobile devices
}
displayUsers(): void {
  this.router.navigateByUrl('user/manageusers');
  //Highlighting the button clicked
  if(!this.highlightUserBtn){
    this.highlightTransacBtn =false;
    this.highlightSettingsBtn = false;
    this.highlightStatsBtn = false;
   this.highlightUserBtn = true;
  }
  this.removeMenu();// for mobile devices
}
displaySets(): void{
  this.router.navigateByUrl('user/settings');
  //Highlighting the button clicked
  if(!this.highlightSettingsBtn){
    this.highlightUserBtn = false;
    this.highlightStatsBtn = false;
    this.highlightTransacBtn =false;
   this.highlightSettingsBtn = true;
   this.removeMenu();// for mobile devices
  }
}

logOut(){
  this.router.navigateByUrl("/");
  sessionStorage.clear();
}
//buttons

}

