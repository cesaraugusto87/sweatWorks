import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { PublicationComponent } from './publications/publications.component';
import { AuthorsComponent } from '@app/static/authors/authors.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'sweatworks.menu.about' }
  },
  {
    path: 'publications',
    component: PublicationComponent,
    data: { title: 'sweatworks.menu.publications' }
  },
  {
    path: 'authors',
    component: AuthorsComponent,
    data: { title: 'sweatworks.menu.authors' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
