import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetAdLinkPageRoutingModule } from './get-ad-link-routing.module';

import { GetAdLinkPage } from './get-ad-link.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetAdLinkPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [GetAdLinkPage]
})
export class GetAdLinkPageModule {}
