import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDashboard]'
})
export class DashboardDirective {

  constructor() { }

  @HostListener('click') onFocus() {
    alert('Click')
  }

}
