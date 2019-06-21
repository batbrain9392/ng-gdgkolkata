import { Component, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit, OnChanges {
  @Input() fileUrl: string;
  @Output() dropped = new EventEmitter<File>();
  caption: string;
  isHovering: boolean;
  backgroundImageUrl: string;

  ngOnInit() {
    this.caption = 'Drag and drop a photo';
    this.backgroundImageUrl = 'none';
  }

  ngOnChanges() {
    this.backgroundImageUrl = `url(${this.fileUrl})`;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    const file = files.item(0);
    this.dropped.emit(file);
    this.backgroundImageUrl = 'none';
    this.caption = `Selected ${file.name}`;
  }
}
