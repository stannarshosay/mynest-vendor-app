import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvertisePageRoutingModule } from './advertise-routing.module';

import { AdvertisePage } from './advertise.page';
import { MaterialModule } from 'src/app/components/material.module';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdvertisePageRoutingModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [AdvertisePage]
})
export class AdvertisePageModule {}
