import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports:[CommonModule,FlexLayoutModule],
  exports: [HeaderComponent],
  declarations: [HeaderComponent]
})
export class SharedModule{}