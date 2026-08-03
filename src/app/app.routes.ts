import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { CelestialObjectCreatePageComponent } from './pages/celestial-objects/celestial-object-create.page';
import { CelestialObjectDetailPageComponent } from './pages/celestial-objects/celestial-object-detail.page';
import { CelestialObjectEditPageComponent } from './pages/celestial-objects/celestial-object-edit.page';
import { CelestialObjectsListPageComponent } from './pages/celestial-objects/celestial-objects-list.page';
import { NotFoundPageComponent } from './pages/not-found/not-found.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'celestial-objects', component: CelestialObjectsListPageComponent },
  { path: 'celestial-objects/new', component: CelestialObjectCreatePageComponent },
  { path: 'celestial-objects/:id/edit', component: CelestialObjectEditPageComponent },
  { path: 'celestial-objects/:id', component: CelestialObjectDetailPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
