import { AfterViewInit, Component, DoCheck, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { forexDataModel } from 'src/app/Models/forex.model';
import { userModel } from 'src/app/Models/profile.model';
import { weekModel } from 'src/app/Models/userweekdata.model';
import { yearModel } from 'src/app/Models/useryeardata.model';
import { ForexService } from 'src/app/Services/forex.service';
import { YoutrackService } from 'src/app/Services/youtrack.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements AfterViewInit{
 //variables
 viewAllValue: boolean = false;
 showAddCardValue: boolean = false;
 forexData?: forexDataModel;
 userProfileData?: userModel;
 recordtype: string = 'income';
 showSpinner: boolean = false;
 removeNotify: boolean = false;
 response?: any;
 userData?: any;
 weekIncomeChartValue?: number[]=[];
 weekExpenseChartValue?: number[]=[];
 yearIncomeChartValue?: number[]=[];
 yearExpenseChartvalue?: number[]=[]
 piechartData?: object[]=[];
 randomColorValue?: any;

 //

constructor(private forexDataService: ForexService,private YoutrackService: YoutrackService,private router: Router){}
  ngAfterViewInit(): void {
    //this.getforexData();
    this.getuserProfileData();
  }
  
  //services
  private getforexData(){
    this.forexDataService.getForexData()
    .subscribe({
      next: (response)=>{
        this.forexData = response;
      }
    });
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
  
  
  
add(descrip: string,cat:any,attachment:any,pv:string,amount: any,addorupdate:boolean): void {
  this.showSpinner = true;
  //The empty string doesn't serve a purpose for making a post request it's just a placeholder for editing a record in all transactions
    this.YoutrackService.addorupdate(descrip,cat,attachment.files[0],pv,amount,this.recordtype,addorupdate,"")
    .subscribe({
      next: (response)=>{
       this.response = response;
       setTimeout(()=>{
        if(this.response.msg){
          this.showSpinner = false;
          this.response =" ";
        }
      }, 3000);
      },
      error: (response)=>{
        this.response = response;
       setTimeout(()=>{
        if(this.response.msg){
          this.showSpinner = false;
          this.response =" ";
        }
      }, 3000);
      }
    })

    
}

randomColor(){
  const randomColor = Math.floor(Math.random()*16877225).toString(16);
  this.randomColorValue= "#"+ randomColor;
}


weekData(){
  this.YoutrackService.getWeekData()
  .subscribe({
    next:(response) =>{
      this.userData = response;
    
      //Formating date
     this.userData[0].Totals[0].transactions.map((value:any,index:number)=>{
        this.userData[0].Totals[0].transactions[index].createdAt=this.userData[0].Totals[0].transactions[index].createdAt.replace("T", " ")
     })

      this.userData[0].Totals[0].transactions.reverse()
      //data allocation for bar chart
      const filter = this.userData[0].weekDayTotals.filter((value:any,index:any)=>{
           //filtering by initial ranking week 
           //this is because this version of the api failed to aggregate to my linking upon very long hrs of research
           return value._id.week === this.userData[0].weekDayTotals[0]._id.week;
      });
     filter.reverse();
     const income = [0,0,0,0,0,0,0];
     const expense = [0,0,0,0,0,0,0]
      for(let i=0 ; i<filter.length; i++){
        if(filter[i]._id.day == i+1){
           income[i]= filter[i].income;
           expense[i]=filter[i].expense;
        }
        else{ 
          income[filter[i]._id.day-1]=filter[i].income;
          expense[filter[i]._id.day-1]=filter[i].expense
        }
      }
      income.map((value:any,index:number)=>{
           this.weekIncomeChartValue?.push(income[index]);
           this.weekExpenseChartValue?.push(expense[index]);
      })

      
     
      //data allocation for pie chart
      this.userData[0].catergoryTotals.map((category:any,index:number)=>{
        const piedata = {name:String,y:Number,color:String};
        this.randomColor();
        if(this.userData[0].catergoryTotals[index]._id.week === this.userData[0].catergoryTotals[0]._id.week){
            //creating an object
              piedata.name = this.userData[0].catergoryTotals[index]._id.category;
              piedata.y = this.userData[0].catergoryTotals[index].totalAmt;
              piedata.color = this.randomColorValue;
              this.piechartData?.push(piedata);
            //end
           // console.log(piedata);
        }
      })
    },
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

      if(this.userData[0].Totals[0]){
        //reversed transaction in order to loop from bottom to top
        this.userData[0].Totals[0].transactions.reverse()
      }


         //data allocation for bar chart
      const filter = this.userData[0].yearMonthTotals.filter((value:any,index:any)=>{
        //filtering by initial ranking week 
        //this is because this version of the api failed to aggregate to my linking upon very long hrs of research
        return value._id.year === this.userData[0].yearMonthTotals[0]._id.year;
   });
  filter.reverse();
  const totalIncome = [0,0,0,0,0,0,0,0,0,0,0,0];
  const totalExpense =[0,0,0,0,0,0,0,0,0,0,0,0]
   for(let i=0 ; i<filter.length; i++){
     if(filter[i]._id.month == i+1){
        totalIncome[i]= filter[i].totalIncome;
        totalExpense[i]=filter[i].totalExpense;
     }
     else{ 
       totalIncome[filter[i]._id.month-1]=filter[i].totalIncome;
       totalExpense[filter[i]._id.month-1]=filter[i].totalExpense
     }
   }
   totalIncome.map((value:any,index:number)=>{
        this.yearIncomeChartValue?.push(totalIncome[index]);
        this. yearExpenseChartvalue?.push(totalExpense[index]);
   })
  
   //data allocation for pie chart
   this.userData[0].catergoryTotals.map((category:any,index:number)=>{
     const piedata = {name:String,y:Number,color:String};
     this.randomColor();
     if(this.userData[0].catergoryTotals[index]._id.year === this.userData[0].catergoryTotals[0]._id.year){
         //creating an object
           piedata.name = this.userData[0].catergoryTotals[index]._id.category;
           piedata.y = this.userData[0].catergoryTotals[index].totalAmt;
           piedata.color = this.randomColorValue;
           this.piechartData?.push(piedata);
         //end
        // console.log(piedata);
     }
   }
   )

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

//end services
onItemChange(target:any){
  this.recordtype = target.value;
}


  //All event buttons
  enableViewAll(): void{
   this.router.navigateByUrl('user/transactions')
  }


  showaddCard(): void{
   this.showAddCardValue = true;
  }
  closeAddCard(): void{
    this.getuserProfileData();
     this.showAddCardValue = false;
  }
  // End of all event buttons


  
  //Charts
  weekChart = new Chart({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Balance Trend By This Week'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Sun','Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      crosshair: true,
      accessibility: {
          description: 'Months'
      }
  },
  yAxis: {
    min: 0,
    title: {
        text: 'Total Amount'
    }
},
plotOptions: {
  column: {
      pointPadding: 0.4,
      borderWidth: 0
  }
},
    series: [
      {
        type: 'column',
        name: 'Income',
        color: 'lightgreen',
        data: this.weekIncomeChartValue 
      },
      {
        type: 'column',
        name: 'Expenses',
        color: 'red',
        data: this.weekExpenseChartValue
      }
    ]
  });

//   monthChart = new Chart({
//     chart: {
//       type: 'column',
//     },
//     title: {
//       text: 'Balance Trend'
//     },
//     credits: {
//       enabled: false
//     },
//     xAxis: {
//       categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9','10','11','12','13','14',
//     '15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
//       crosshair: true,
//       accessibility: {
//           description: 'Months'
//       }
//   },
//   yAxis: {
//     min: 0,
//     title: {
//         text: 'Total Amount'
//     }
// },
// plotOptions: {
//   column: {
//       pointPadding: 0.3,
//       borderWidth: 0
//   }
// },
//     series: [
//       {
//         type: 'column',
//         name: 'Income',
//         color: 'lightgreen',
//         data: [1,2,3,1,5,6,4,1,5,6,7,2,1,2,3,1,5,6,4,1,5,6,7,2,1,2,3,1,5,6]
//       },
//       {
//         type: 'column',
//         name: 'Expenses',
//         color: 'red',
//         data: [2,3,1,5,6,4,1,5,6,7,2,1,2,3,1,5,6,8,1,2,3,1,5,6,4,1,5,6,7,2]
//       }
//     ]
//   });

  yearChart = new Chart({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Balance Trend By This Year',
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'],
      crosshair: true,
      accessibility: {
          description: 'Months'
      }
  },
  yAxis: {
    min: 0,
    title: {
        text: 'Total Amount'
    }
},
plotOptions: {
  column: {
      pointPadding: 0.3,
      borderWidth: 0
  }
},
    series: [
      {
        type: 'column',
        name: 'Income',
        color: 'lightgreen',
        data: this.yearIncomeChartValue
      },
      {
        type: 'column',
        name: 'Expenses',
        color: 'red',
        data: this.yearExpenseChartvalue
      }
    ]
  });


  pieChart = new Chart({
    chart: {
      type: 'pie',
      plotShadow: false,
    },
  
    credits: {
      enabled: false,
    },
  
    plotOptions: {
      pie: {
        innerSize: '100%',
        size:'60%',
        borderWidth: 10,
        borderColor: '',
        slicedOffset: 10,
        dataLabels: {
          connectorWidth: 0,
        },
      },
    },
  
    title: {
      verticalAlign: 'middle',
      floating: false,
      text: 'Category',
    },
  
    legend: {
      enabled: false,
    },
  
    series: [
      {
        type: 'pie',
        name: 'Amt',
        data:this.piechartData,
      },
    ],
  });
 //End of Chart
}
