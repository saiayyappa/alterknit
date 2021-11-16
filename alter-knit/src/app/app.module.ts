import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { OurWorkComponent } from './pages/our-work/our-work.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { WhyAlterknitComponent } from './pages/why-alterknit/why-alterknit.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OurWorkComponent,
    OurServicesComponent,
    WhyAlterknitComponent,
    HeaderComponent,
    FooterComponent,
    OrdersComponent,
    SigninComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
