import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendQuotePage } from './send-quote.page';

const routes: Routes = [
  {
    path: '',
    component: SendQuotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendQuotePageRoutingModule {}
