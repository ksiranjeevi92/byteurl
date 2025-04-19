import { Component, signal } from '@angular/core';

import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-side-bar',
  imports: [DragDropModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  defaultWidth: number = 250;

  currentWidth = signal(this.defaultWidth);

  onDragMove(event: CdkDragMove) {
    this.currentWidth.set(event.pointerPosition.x);
    const element = event.source.element.nativeElement;
    element.style.transform = null;
  }
}
