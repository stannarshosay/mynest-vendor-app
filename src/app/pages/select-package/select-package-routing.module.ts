import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPackagePage } from './select-package.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPackagePageRoutingModule {}
