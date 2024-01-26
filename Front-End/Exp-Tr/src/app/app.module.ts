import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInSignUpComponent } from './components/log-in-sign-up/log-in-sign-up.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardDirective } from './components/dashboard/dashboard.directive';
import { ChartModule } from 'angular-highcharts';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { Filter } from './components/transactions/filter.pipe';
import { UsersFilter } from './components/manageusers/filter.pipe'
import { ManageusersComponent } from './components/manageusers/manageusers.component';
import { TransListFilter } from './components/manageusers/translistfilter.pipe';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { AdminstatisticsComponent } from './components/adminstatistics/adminstatistics.component';
import { AdminUsersFilter } from './components/adminstatistics/filter.pipe';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInSignUpComponent,
    DashboardComponent,
    StatisticsComponent,
    SettingsComponent,
    DashboardDirective,
    TransactionsComponent,
    Filter,
    UsersFilter,
    AdminUsersFilter,
    TransListFilter,
    ManageusersComponent,
    AdmindashboardComponent,
    AdminstatisticsComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
