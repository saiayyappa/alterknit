import { RouterModule, Routes } from '@angular/router';

import { AddItemsComponent } from './pages/orders/add-items/add-items.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { OrdersComponent } from './pages/orders/orders.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { OurWorkComponent } from './pages/our-work/our-work.component';
import { PickupAddressComponent } from './pages/orders/pickup-address/pickup-address.component';
import { ReviewComponent } from './pages/orders/review/review.component';
import { ShipmentMethodComponent } from './pages/orders/shipment-method/shipment-method.component';
import { ShippingAddressComponent } from './pages/orders/shipping-address/shipping-address.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { WhyAlterknitComponent } from './pages/why-alterknit/why-alterknit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'our-services', component: OurServicesComponent },
  { path: 'our-work', component: OurWorkComponent },
  { path: 'why-alterknit', component: WhyAlterknitComponent },
  { path: 'sign-in', component: SigninComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'contact-us', component: ContactComponent },
  {
    path: 'orders', component: OrdersComponent, children: [
      { path: '', component: ShipmentMethodComponent }, // choose shipment method
      { path: 'select-service', component: AddItemsComponent }, // select service and sweater items
      // when shipment is selected
      { path: 'shipping', component: ShippingAddressComponent }, // add billing and shipping address
      // when pick up is selected
      { path: 'pick-up', component: PickupAddressComponent }, // add pick up address
      { path: 'review', component: ReviewComponent }, // review items
    ]
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
