import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../types/todo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  @Output() delete = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() rename = new EventEmitter<string>();

  @Input() todo!: Todo;

  @ViewChild('titleField')
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus()
    }
  }

  isEditing = false;
  title = '';

  edit() {
    this.isEditing = true;
    this.title = this.todo.title;
  }

  save() {
    if (!this.isEditing) {
      return;
    }

    this.isEditing = false;
    this.rename.emit(this.title);
  }
}
