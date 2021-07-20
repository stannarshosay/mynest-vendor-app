import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoveAgentPage } from './remove-agent.page';

const routes: Routes = [
  {
    path: '',
    component: RemoveAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoveAgentPageRoutingModule {}
