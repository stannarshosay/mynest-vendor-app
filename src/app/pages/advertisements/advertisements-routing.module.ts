import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertisementsPage } from './advertisements.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertisementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertisementsPageRoutingModule {}
