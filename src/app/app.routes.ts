import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { NotFoundPageComponent } from './pages/not-found/not-found.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '**', component: NotFoundPageComponent },
];
