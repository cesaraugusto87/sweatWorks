import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import {ROUTE_ANIMATIONS_ELEMENTS} from '@app/core';
import {FormBuilder} from "@angular/forms";
import {BackendApiService} from '@app/services/backend-api.service';
import {Publications} from "@app/static/publications/publications.model";
import {Observable} from "rxjs/index";

@Component({
  selector: 'sweatworks-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  searchFormGroup = this.fb.group({title: ''});
  searchResult: boolean = false;
  publications$: Observable<Publications[]>;

  constructor(public fb: FormBuilder, private dataService: BackendApiService) {
  }

  ngOnInit() {
  }

  search(name) {
    if (this.searchFormGroup.valid) {
      const search = this.searchFormGroup.value;
      this.searchResult = true;
      this.publications$ = this.dataService.getPublicationsBySearch(search.title)
    }
  }
}
