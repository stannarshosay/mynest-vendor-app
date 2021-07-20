import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertisePage } from './advertise.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertisePageRoutingModule {}
