import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'filter'
   }
)

export class Filter implements PipeTransform {
    transform(userData: any[], recordValue: string,searchValue:any):any {
        
        //checking if transactions exist
        if(userData[0].Totals[0]){
            if(!searchValue){
                if(recordValue === "income"){
                    let income = userData[0].Totals[0].transactions.filter((item:any)=>{
                    if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                        return item;
                    }
                    });
                return income;
            }
            else if(recordValue === "expense"){
                let expense = userData[0].Totals[0].transactions.filter((item:any)=>{
                    if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                        return item;
                    }
                    });
                return expense;
            }
            else{
                return userData[0].Totals[0].transactions;
            }
            }

            else if(searchValue && recordValue != "All"){
                   if(recordValue === "income"){
                       let income = userData[0].Totals[0].transactions.filter((item:any)=>{
                          if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                             return item;
                          }
                        });
                        
                        let search= income.filter((item:any)=>{
                            if((item.description.toLowerCase()).includes((searchValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchValue.toLowerCase()))){
                                return item;
                        }  
                        })
    
                     if(search.length > 0){
                        return search;
                     }
                }
                else{
                    let expense = userData[0].Totals[0].transactions.filter((item:any)=>{
                        if((item.recordType.toLowerCase()).includes((recordValue.toLowerCase()))){
                           return item;
                        }
                      });
                      
                      let search= expense.filter((item:any)=>{
                          if((item.description.toLowerCase()).includes((searchValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchValue.toLowerCase()))){
                              return item;
                      }  
                      })
    
                   if(search.length > 0){
                      return search;
                   }
                }
            }
            else{
                return userData[0].Totals[0].transactions.filter((item:any)=>{
                    if((item.description.toLowerCase()).includes((searchValue.toLowerCase())) || (item.category.toLowerCase()).includes((searchValue.toLowerCase())) || (item.pv.toLowerCase()).includes((searchValue.toLowerCase()))){
                        return item;
                   }
                  
                 })
            }
        }

         
    }
    
}