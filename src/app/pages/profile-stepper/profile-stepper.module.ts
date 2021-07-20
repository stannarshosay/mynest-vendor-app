import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileStepperPageRoutingModule } from './profile-stepper-routing.module';

import { ProfileStepperPage } from './profile-stepper.page';
import { MaterialModule } from 'src/app/components/material.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileStepperPageRoutingModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAht4CA4uUlXg-kv-3sxkWo8xJzyJO2Ss'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
    })
  ],
  declarations: [ProfileStepperPage]
})
export class ProfileStepperPageModule {}
