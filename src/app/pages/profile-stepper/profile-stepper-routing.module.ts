import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileStepperPage } from './profile-stepper.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileStepperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileStepperPageRoutingModule {}
