import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {EventViewComponent} from "./event-view/event-view.component";

const routes: Routes = [
  { path: '', component: EventListComponent, pathMatch: 'full' },
  { path: 'events/:id', component: EventViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
