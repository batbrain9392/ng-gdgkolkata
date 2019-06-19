import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { DropzoneDirective } from './directives/dropzone.directive';

import { DropzoneComponent } from './components/dropzone/dropzone.component';

@NgModule({
  declarations: [DropzoneDirective, DropzoneComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [MaterialModule, ReactiveFormsModule, DropzoneComponent]
})
export class SharedModule {}
