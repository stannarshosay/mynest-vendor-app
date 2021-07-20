import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendQuotePageRoutingModule } from './send-quote-routing.module';

import { SendQuotePage } from './send-quote.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendQuotePageRoutingModule,
    MaterialModule
  ],
  declarations: [SendQuotePage]
})
export class SendQuotePageModule {}
