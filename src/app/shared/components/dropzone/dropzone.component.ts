import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent {
  @Output() dropped = new EventEmitter<File>();
  isHovering: boolean;

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    this.dropped.emit(files.item(0));
  }
}
