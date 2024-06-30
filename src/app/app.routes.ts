import { Routes } from '@angular/router';
import { TodosPageComponent } from './components/todos-page/todos-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';

export const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'todos/:status', component: TodosPageComponent },
  { path: '**', redirectTo: 'todos/all', pathMatch: 'full' },
];
