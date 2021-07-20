import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefferalCodePageRoutingModule } from './refferal-code-routing.module';

import { RefferalCodePage } from './refferal-code.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RefferalCodePageRoutingModule,
    MaterialModule
  ],
  declarations: [RefferalCodePage]
})
export class RefferalCodePageModule {}
