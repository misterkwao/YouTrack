import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forexDataModel } from '../Models/forex.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForexService {

  constructor(private http: HttpClient) { }

   getForexData(): Observable<forexDataModel>{
      return this.http.get<forexDataModel>('http://api.exchangeratesapi.io/v1/latest?access_key=4f0a6ae423926b85a1526b545d36c045');
   }
  
}
