import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportRequirementPageRoutingModule } from './report-requirement-routing.module';

import { ReportRequirementPage } from './report-requirement.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReportRequirementPageRoutingModule,
    MaterialModule
  ],
  declarations: [ReportRequirementPage]
})
export class ReportRequirementPageModule {}
