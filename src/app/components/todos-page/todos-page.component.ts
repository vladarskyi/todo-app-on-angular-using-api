import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/todo';
import { TodoComponent } from '../todo/todo.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../../types/status';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TodoComponent,
    ErrorMessageComponent,
    CommonModule,
    TodosPageComponent,
    FilterComponent,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss'
})
export class TodosPageComponent implements OnInit{
  todos$ = this.todosService.todos$
  activeTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.completed))
  );
  completedTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => todo.completed))
  );
  activeCount$ = this.activeTodos$.pipe(
    map(todos => todos.length)
  );
  visibleTodos$ = this.route.params.pipe(
    switchMap(params => {
      switch (params['status'] as Status) {
        case 'active':
          return this.activeTodos$;
        case 'completed':
          return this.completedTodos$;
        default:
          return this.todos$;
      }
    })
  )

  title = new FormControl('', Validators.required);

  constructor(
    private todosService: TodosService,
    private errorMessageService: ErrorMessageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe();

    this.todosService.loadTodos()
      .subscribe({
        error: () => this.errorMessageService.showMessage(Errors.Load),
      });
  }

  handleFormSubmit() {
    if (this.title.invalid) {
      return;
    }

    this.addTodo(this.title.value as string)
    this.title.reset();
  }

  addTodo(title: string) {
    this.todosService.createTodo(title)
      .subscribe({
        error: () => this.errorMessageService.showMessage(Errors.Add),
      });
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title })
      .subscribe({
        error: () => this.errorMessageService.showMessage(Errors.Update),
      });
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed })
      .subscribe({
        error: () => this.errorMessageService.showMessage(Errors.Toggle),
      });
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo)
      .subscribe({
        error: () => this.errorMessageService.showMessage(Errors.Delete),
      });
  }
}
