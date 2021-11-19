import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddItemModalComponent } from './common/add-item-modal/add-item-modal.component';
import { AddItemsComponent } from './pages/orders/add-items/add-items.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from './data.service';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ImageViewerComponent } from './common/image-viewer/image-viewer.component';
import { NgModule } from '@angular/core';
import { OrdersComponent } from './pages/orders/orders.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { OurWorkComponent } from './pages/our-work/our-work.component';
import { PickupAddressComponent } from './pages/orders/pickup-address/pickup-address.component';
import { ReviewComponent } from './pages/orders/review/review.component';
import { ShipmentMethodComponent } from './pages/orders/shipment-method/shipment-method.component';
import { ShippingAddressComponent } from './pages/orders/shipping-address/shipping-address.component';
import { SigninComponent } from './pages/signin/signin.component';
import { TermsModalComponent } from './common/terms-modal/terms-modal.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { WhyAlterknitComponent } from './pages/why-alterknit/why-alterknit.component';
import { StepperComponent } from './common/stepper/stepper.component';
import { OrderReviewComponent } from './common/order-review/order-review.component';

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
    ThankYouComponent,
    ImageViewerComponent,
    ShipmentMethodComponent,
    AddItemsComponent,
    ShippingAddressComponent,
    PickupAddressComponent,
    ReviewComponent,
    AddItemModalComponent,
    TermsModalComponent,
    StepperComponent,
    OrderReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ DataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
