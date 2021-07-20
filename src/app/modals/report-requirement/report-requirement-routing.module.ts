import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportRequirementPage } from './report-requirement.page';

const routes: Routes = [
  {
    path: '',
    component: ReportRequirementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRequirementPageRoutingModule {}
