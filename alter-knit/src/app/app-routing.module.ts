import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { OurWorkComponent } from './pages/our-work/our-work.component';
import { WhyAlterknitComponent } from './pages/why-alterknit/why-alterknit.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'our-services', component: OurServicesComponent},
  { path: 'our-work', component: OurWorkComponent},
  { path: 'why-alterknit', component: WhyAlterknitComponent},
  { path: 'sign-in', component: SigninComponent},
  { path: 'thank-you', component: ThankYouComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
