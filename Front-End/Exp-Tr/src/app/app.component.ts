import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'YouTrack';
  valueStore: any = Boolean(localStorage.getItem('hideLogin') )|| false;
  navtoDashboard?: boolean = this.valueStore;
  fromChild(event: any): void {
    this.navtoDashboard = event;
   // localStorage.setItem('hideLogin', String(true)); //To prevent previous template from loading
}
}
