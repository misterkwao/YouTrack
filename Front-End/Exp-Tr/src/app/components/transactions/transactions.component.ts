import { AfterViewInit, Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { userModel } from 'src/app/Models/profile.model';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements AfterViewInit{
  
  //Variables
  userData?: any;
  userProfileData?: userModel;
  recordtype: string = '';
 showSpinner: boolean = false;
 removeNotify: boolean = false;
 response?: any;
 showFormValue?: boolean = false;
 recordID?: string="";
 Amount?: number;
 Pv: string = "";
 Description: string = "";
Category: string = "";
recordValue: string = "All";
searchValue?: any ;

  constructor(private YoutrackService: YoutrackService){}
  
  
  ngAfterViewInit(): void {
    this.getuserProfileData();
  }

  getuserProfileData(){
    this.YoutrackService.getUserProfile()
    .subscribe({
      next: (response)=>{
        this.userProfileData = response;
        //setting data
        this.getData();
      }
    })
  }
  getData(){
    if(this.userProfileData?.filterBy === "year"){
      this.yearData();
    }
    else{
      this.weekData();
    }
  }

  weekData(){
    this.YoutrackService.getWeekData()
    .subscribe({
      next:(response) =>{
        this.userData = response;
          //Formating date
  //    this.userData[0].Totals[0].transactions.map((value:any,index:number)=>{
  //     this.userData[0].Totals[0].transactions[index].createdAt=this.userData[0].Totals[0].transactions[index].createdAt.replace("T", " ");
  //     this.userData[0].Totals[0].transactions[index].createdAt = this.userData[0].Totals[0].transactions[index].createdAt.substring(0, this.userData[0].Totals[0].transactions[index].createdAt.indexOf('.'))
  //  })
        this.userData[0].Totals[0].transactions.reverse()
      }
    })
  }
  
  
  yearData(){
    this.YoutrackService.getYearData()
    .subscribe({
      next:(response)=>{
        this.userData = response;
        //Formating date
  //    this.userData[0].Totals[0].transactions.map((value:any,index:number)=>{
  //     this.userData[0].Totals[0].transactions[index].createdAt=this.userData[0].Totals[0].transactions[index].createdAt.replace("T", " ");
  //     this.userData[0].Totals[0].transactions[index].createdAt = this.userData[0].Totals[0].transactions[index].createdAt.substring(0, this.userData[0].Totals[0].transactions[index].createdAt.indexOf('.'))
  //  })

        if(this.userData[0].Totals[0]){ // if there are no transactions
          this.userData[0].Totals[0].transactions.reverse()
        }
        
      }
    })
  }

  update(descrip: string,cat:any,attachment:any,pv:string,amount: any,AddOrUpdate:boolean): void {
    this.showSpinner = true;
   //console.log(descrip,cat,attachment.files[0],pv,amount,AddOrUpdate,this.recordID,this.recordtype)
      this.YoutrackService.addorupdate(descrip,cat,attachment.files[0],pv,amount,this.recordtype,AddOrUpdate,this.recordID)
      .subscribe({
        next: (response)=>{
         this.response = response;
         console.log(this.response)
           setTimeout(()=>{
        if(this.response.msg){
          this.showSpinner = false;
          this.response =" ";
        }
      }, 2000);
    },
     error: (response)=>{
      this.response = response;
      setTimeout(()=>{
   if(this.response.msg){
     this.showSpinner = false;
     this.response =" ";
   }
 }, 2000);
     }
  })  
  }


//click events
onItemChange(target:any){
  this.recordtype = target.value;

}

showForm(id:string){
  this.recordID = id;
  //displaying values
  this.userData[0].Totals[0].transactions.filter((value:any,index:number)=>{
        if(this.userData[0].Totals[0].transactions[index]._id === this.recordID){
          this.Amount = this.userData[0].Totals[0].transactions[index].amount;
          this.Pv = this.userData[0].Totals[0].transactions[index].pv;
          this.Description =this.userData[0].Totals[0].transactions[index].description;
          this.recordtype =this.userData[0].Totals[0].transactions[index].recordType;
          this.Category = this.userData[0].Totals[0].transactions[index].category;
        }
  })
  //end
  this.showFormValue = true;
 }

closeForm(){
  this.getuserProfileData();
  this.showFormValue = false;
}

filterBy(){
  if(this.userProfileData?.filterBy === "week"){
    this.YoutrackService.updateUserProfile("filterY","year")
    .subscribe({
      next:(response)=>{
        this.getuserProfileData();
      }
    });
  }
  else{
    this.YoutrackService.updateUserProfile("filterW","week")
    .subscribe({
      next:(response)=>{
        this.getuserProfileData();
      }
    });
  }
}

 deleteRecord(value:any){
   this.YoutrackService.deleteRecord(value)
   .subscribe({
    next: (response)=>{
      this.response.msg = response;
      console.log(this.response)
        setTimeout(()=>{
     if(this.response.msg){
       this.showSpinner = false;
       this.response =" ";
       this.getuserProfileData();
     }
   }, 2000);
 },
  error: (response)=>{
   this.response.msg = response;
   setTimeout(()=>{
if(this.response.msg){
  this.showSpinner = false;
  this.response =" ";
}
}, 2000);
  }
   })
 }
//


}
