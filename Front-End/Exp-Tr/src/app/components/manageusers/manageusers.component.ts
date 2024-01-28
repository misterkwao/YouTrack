import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AllUserTransactions } from 'src/app/Models/allUserTransactions.model';
import { muModel } from 'src/app/Models/manageusers.model';
import { userModel } from 'src/app/Models/profile.model';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent implements AfterViewInit {
 //Variables
data?:muModel;
piechartData?: object[]=[];
topCategories?: any[]=[];
currency?: string;
searchValue?: any ;
searchTransListValue?: any;
recordValue: string = "All";
allUserTransactions?: AllUserTransactions;
recordID?: string="";
showSpinner: boolean = false;
removeNotify: boolean = false;
recordResponse?: any;
Amount?: number;
Pv?: string;
Description?: string ;
Category?: string ;
recordtype?: any ;
showFormValue?: boolean = false;
userProfileData?: userModel;
sortDateValue?: string = "year"
canEdit?: boolean = false

  constructor(private YoutrackService: YoutrackService){}

  ngAfterViewInit(): void {
    this.getManageUsersData()
  }

  getManageUsersData(){
    this.YoutrackService.getManageUsersStats()
    .subscribe({
      next: (response) =>{
        this.getuserProfileData(); //get the current logged in user to check for permissions
        this.getAllUserTransactions()
        this.data = response;
        this.currency = this.data.users[0].currencyType;
        //creating pie chart data
        this.piechartData?.push({name:'Current Bal', color: 'green',y: response.totalAmounts.currentAmount})
        this.piechartData?.push({name:'Total Inc', color: 'purple',y: response.totalAmounts.totalIncome});
        this.piechartData?.push({name:'Total Exp', color: '#FF0000',y: response.totalAmounts.totalExpense})
        //

        //creating top category data
        this.topCategories = this.data.categories.filter((value:any,index:any)=>{
          return value._id.year === new Date().getFullYear(); 
              });
          this.topCategories = this.topCategories.slice(0,3)
      }
    })
    
  }

  getAllUserTransactions(){
    this.YoutrackService.getAllUserTransactions()
    .subscribe({
      next: (response) =>{
       this.allUserTransactions = response;
       this.allUserTransactions.transactions.reverse();
      }
    })
  }

  getuserProfileData(){
    this.YoutrackService.getUserProfile()
    .subscribe({
      next: (response)=>{
        this.userProfileData = response;
        if(this.userProfileData.permissions.includes("eur")){
          this.canEdit = true;
        }
      }
    })
  }
  

  update(descrip: string,cat:any,attachment:any,pv:string,amount: any): void {
    this.showSpinner = true;
   //console.log(descrip,cat,attachment.files[0],pv,amount,AddOrUpdate,this.recordID,this.recordtype)
      this.YoutrackService.updateUserRecord(descrip,cat,attachment.files[0],pv,amount,this.recordtype,this.recordID)
      .subscribe({
        next: (response)=>{
         this.recordResponse = response;
        }
      })
  
      setTimeout(()=>{
        if(this.recordResponse.msg === "Record added successfully"){
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
  }


//click events
onItemChange(target:any){
  this.recordtype = target.value;

}
  showForm(id:string){
    this.recordID = id;
    //displaying values
    this.allUserTransactions?.transactions.filter((value:any,index:number)=>{
          if(this.allUserTransactions?.transactions[index]._id === this.recordID){
            this.Amount = this.allUserTransactions?.transactions[index].amount;
            this.Pv = this.allUserTransactions?.transactions[index].pv;
            this.Description = this.allUserTransactions?.transactions[index].description;
            this.recordtype =this.allUserTransactions?.transactions[index].recordType;
            this.Category = this.allUserTransactions?.transactions[index].category;
          }
    })
    //end
    this.showFormValue = true;
   }

  closeForm(){
    this.getAllUserTransactions();
    this.showFormValue = false;
  }

  deleteRecord(value:any){
    this.YoutrackService.deleteRecord(value)
    .subscribe({
     next:(response)=>{
       console.log(response);
       this.getManageUsersData();
     }
    })
  }

  pieChart = new Chart({
    chart: {
      type: 'pie',
      inverted: true,
      polar: true
    },
  
    credits: {
      enabled: false,
    },
  
    plotOptions: {
      pie: {
        innerSize: '60%',
        size:'60%',
        borderWidth: 3,
        slicedOffset: 0,
        dataLabels: {
          connectorWidth: 0,
        },
      },
    },
  
    title: {
      verticalAlign: 'top',
      floating: true,
      text: 'All Amounts',
    },
    series: [
      {
        type: 'pie',
        name: 'Ghs',
        data: this.piechartData,
      },
    ],
  });
}
