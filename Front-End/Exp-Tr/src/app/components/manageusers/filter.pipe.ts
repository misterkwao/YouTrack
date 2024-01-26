import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'usersfilter'
   }
)

export class UsersFilter implements PipeTransform {
    transform(users: any[], searchValue:any):any {
        if(users){
            if(!searchValue){
                return users;
            }
            else{
                return users.filter((item:any)=>{
                    if((item.name.toLowerCase()).includes((searchValue.toLowerCase()))){
                        return item;
                }  
                })
            }
        }
    }
    
}