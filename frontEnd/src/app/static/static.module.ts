import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import {AuthorsComponent} from "@app/static/authors/authors.component";
import {PublicationComponent} from "@app/static/publications/publications.component";

@NgModule({
  imports: [SharedModule, StaticRoutingModule],
  declarations: [AboutComponent, AuthorsComponent, PublicationComponent]
})
export class StaticModule {}
