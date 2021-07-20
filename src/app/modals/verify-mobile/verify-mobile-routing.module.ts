import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyMobilePage } from './verify-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyMobilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyMobilePageRoutingModule {}
