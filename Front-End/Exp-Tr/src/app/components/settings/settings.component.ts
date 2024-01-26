import { AfterViewInit, Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements AfterViewInit {
   //Variables
   showSpinnerP: boolean = false;
   showSpinnerU: boolean = false;
   showSpinnerC: boolean = false;
   showSpinnerFw: boolean = false;
   showSpinnerFy: boolean = false;
   showSpinnerCr: boolean = false;
   removeNotify: boolean = true;
   responseText?: any;
   categoryValue?: string;
   userCategories?: any[''];
   activateCatBtn: boolean = true;
   value?: any[""];

  constructor(private router: Router,private YoutrackService: YoutrackService){}
  ngAfterViewInit(): void {
    this.YoutrackService.getUserProfile()
    .subscribe({
      next:(response)=>{
        this.userCategories = response.userCategory; 
          this.userCategories.map((value:string,index:number)=>{
               this.userCategories[index] = (this.userCategories[index]).toLowerCase()
          })
      }
    });
  }
    
    loaders(): void{
      setTimeout(()=>{
        if(this.responseText.msg === "Updated successfully"){
          this.showSpinnerP = false;
          this.showSpinnerU = false;
          this.showSpinnerC = false;
          this.showSpinnerFw = false;
          this.showSpinnerFy = false;
          this.showSpinnerCr = false;

          this.removeNotify = true;
        }
        else{
           this.showSpinnerP = false;
          this.showSpinnerU = false;
          this.showSpinnerC = false;
          this.showSpinnerFw = false;
          this.showSpinnerFy = false;
          this.showSpinnerCr = false;
          this.removeNotify = true;
        }
      }, 2000);
      this.responseText ="";
      this.removeNotify = false;
    }

    updateUser(updateType: string,updateValue: any){
      switch(updateType){
        case 'profilePic':
              this.showSpinnerP = true;
              this.YoutrackService.updateUserProfile(updateType,updateValue.files[0])
              .subscribe({
                next:(response)=>{
                  this.responseText = response
                  console.log(this.responseText);
                  this.loaders();
                }
              });
              break;
        case 'username':
            this.showSpinnerU = true;
            this.YoutrackService.updateUserProfile(updateType,updateValue)
            .subscribe({
              next:(response)=>{
                console.log(response);
                this.loaders()
              }
            });
            break;
        case 'category':
            this.showSpinnerC =true
            this.YoutrackService.updateUserProfile(updateType,updateValue)
            .subscribe({
              next:(response)=>{
                console.log(response);
                this.loaders()
                this.activateCatBtn = true;
              }
            });
            break;
        case 'filterW':
            this.showSpinnerFw = true
            this.YoutrackService.updateUserProfile(updateType,updateValue)
            .subscribe({
              next:(response)=>{
                console.log(response);
                this.loaders();
              }
            });
            break;
        case 'filterY':
            this.showSpinnerFy = true;
            this.YoutrackService.updateUserProfile(updateType,updateValue)
            .subscribe({
              next:(response)=>{
                console.log(response);
                this.loaders();
              }
            });
            break;
         default:
            this.showSpinnerCr = true;
            this.YoutrackService.updateUserProfile(updateType,updateValue)
            .subscribe({
              next:(response)=>{
                console.log(response);
                this.loaders();
              }
            });
       }
    }
    
    categoryField(){
     this.value = this.userCategories?.filter((category:any)=>{
          //category = category.toLowerCase();
       if(category.includes((this.categoryValue)?.toLowerCase())){
              return true;
          }
        else {
            return false;
        }
         })

        if((this.value)?.length > 0){
          this.activateCatBtn = true;
          console.log((this.value));
        }
        else{
          this.activateCatBtn = false;
          console.log(this.value)
        }
    }

}
