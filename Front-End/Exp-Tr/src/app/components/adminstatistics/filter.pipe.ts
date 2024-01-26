import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'adminusersfilter'
   }
)

export class AdminUsersFilter implements PipeTransform {
    transform(users: any[], searchValue:any):any {
        if(users){
            if(!searchValue){
                return users;
            }
            else{
                return users.filter((item:any)=>{
                    if((item.user.toLowerCase()).includes((searchValue.toLowerCase()))){
                        return item;
                }  
                })
            }
        }
    }
    
}