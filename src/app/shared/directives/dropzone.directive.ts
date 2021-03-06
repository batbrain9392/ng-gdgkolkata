import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective {
  @Output() dropped = new EventEmitter<File>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();
    const files = $event.dataTransfer.files as FileList;
    this.dropped.emit(files.item(0));
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
