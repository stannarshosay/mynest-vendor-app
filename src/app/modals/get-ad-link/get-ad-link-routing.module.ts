import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetAdLinkPage } from './get-ad-link.page';

const routes: Routes = [
  {
    path: '',
    component: GetAdLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetAdLinkPageRoutingModule {}
