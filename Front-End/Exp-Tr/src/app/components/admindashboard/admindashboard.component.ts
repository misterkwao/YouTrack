import { Router } from '@angular/router';
import { adminModel, userModel } from 'src/app/Models/profile.model';
import { YoutrackService } from 'src/app/Services/youtrack.service';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements AfterViewInit {
  
  //Variables
  highlightStatsBtn: boolean =  true;
  highlightSettingsBtn: boolean = false;
  showMenuValue: boolean = false;
  userProfileData?: adminModel;
 
constructor(private router: Router,private YoutrackService: YoutrackService){}

  ngAfterViewInit(): void {
    this.getAdminProfileData();
  }
 
private getAdminProfileData(){
  this.YoutrackService.getAdminProfile()
  .subscribe({
    next: (response)=>{
     this.userProfileData = response
     sessionStorage.setItem("role", this.userProfileData.role)
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
    this.router.navigateByUrl('admin/dashboard');
    //Highlighting the button clicked
    if(!this.highlightStatsBtn){
      this.highlightSettingsBtn = false;
      this.highlightStatsBtn = true;
    }
    this.removeMenu();// for mobile devices
}

displaySets(): void{
  this.router.navigateByUrl('admin/settings');
  //Highlighting the button clicked
  if(!this.highlightSettingsBtn){
    this.highlightStatsBtn = false;
   this.highlightSettingsBtn = true;
   this.removeMenu();// for mobile devices
  }
}

logOut(){
  this.router.navigateByUrl("/");
  sessionStorage.clear();
}
}
