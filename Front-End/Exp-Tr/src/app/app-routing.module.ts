import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LogInSignUpComponent } from './components/log-in-sign-up/log-in-sign-up.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ManageusersComponent } from './components/manageusers/manageusers.component';
import { hasRoleGuard } from './hasRole.guard';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { AdminstatisticsComponent } from './components/adminstatistics/adminstatistics.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';


const routes: Routes = [
  {
    path: '',
    component:  LogInSignUpComponent
  },
  {
    path: 'user', component: DashboardComponent, children: [
      { path: 'dashboard', component: StatisticsComponent },
      { path: 'settings', component: SettingsComponent },
      {path:'transactions',component:TransactionsComponent},
      {path: 'manageusers',component:ManageusersComponent, canActivate: [hasRoleGuard]}
    ]
  },
  {
    path: 'admin', component: AdmindashboardComponent, children: [
      { path: 'dashboard', component: AdminstatisticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  {path: 'forgotpassword', component: ForgotPasswordComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
