import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'translistfilter'
   }
)

export class TransListFilter implements PipeTransform {
    transform(userTransListData: any[], recordValue: string,searchTransListValue:any, dateValue:any):any {
        //checking if transactions exist
        if(userTransListData){
            //filtering the transactions per current date selection
            switch(dateValue){
                case "year":
                    userTransListData = userTransListData.filter((item:any)=>{
                        if(new Date().getFullYear() === new Date(item.createdAt).getFullYear()){
                            return item;
                        }
                    })
                   break;

                case "month":
                    userTransListData = userTransListData.filter((item:any)=>{
                        if((new Date().getFullYear() === new Date(item.createdAt).getFullYear()) && ((new Date().getMonth()) === new Date(item.createdAt).getMonth())){
                            return item;
                        }
                    })
                  break;
                
                default:
                    userTransListData = userTransListData.filter((item:any)=>{
                        if((new Date().getFullYear() === new Date(item.createdAt).getFullYear()) && ((new Date().getDate()) === new Date(item.createdAt).getDate())){
                            return item;
                        }
                    })
            }
            
            if(!searchTransListValue){
                    if(recordValue === "income"){
                        let income = userTransListData.filter((item:any)=>{
                        if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                            return item;
                        }
                        });
                    return income;
                }
                else if(recordValue === "expense"){
                    let expense = userTransListData.filter((item:any)=>{
                        if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                            return item;
                        }
                        });
                    return expense;
                }
                else{
                    return userTransListData;
                }
             
            }

            else if(searchTransListValue && recordValue != "All"){
                   if(recordValue === "income"){
                       let income = userTransListData.filter((item:any)=>{
                        if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                            return item;
                         }
                        });
                        
                        let search= income.filter((item:any)=>{
                            if((item.description.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.creatorName.toLowerCase()).includes((searchTransListValue.toLowerCase()))){
                                return item;
                        }   
                        });
                     if(search.length > 0){
                        return search;
                     }
                    
                }
                else{
                    let expense = userTransListData.filter((item:any)=>{
                        if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                            return item;
                         }
                      });
                      
                      let search= expense.filter((item:any)=>{
                        if((item.description.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.creatorName.toLowerCase()).includes((searchTransListValue.toLowerCase()))){
                            return item;
                    }  
                      })
    
                   if(search.length > 0){
                      return search;
                   }
                   
                }
            }
            else{
                return userTransListData.filter((item:any)=>{
                    if((item.description.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchTransListValue.toLowerCase())) || (item.creatorName.toLowerCase()).includes((searchTransListValue.toLowerCase()))){
                        return item;
                   }
                  
                 })
            }
        }
         
    }
    
}