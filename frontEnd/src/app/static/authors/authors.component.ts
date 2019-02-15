import {v4 as uuid} from 'uuid';
import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {FormBuilder, NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {ROUTE_ANIMATIONS_ELEMENTS, NotificationService} from '@app/core';

import {State} from '../app.state';
import {Authors} from './authors.model';
import {BackendApiService} from '@app/services/backend-api.service';
import {Publications} from "@app/static/publications/publications.model";

@Component({
  selector: 'sweatworks-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorsComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  authorFormGroup = this.fb.group(AuthorsComponent.createPublication());
  authors$: Observable<Authors[]>;
  publications$: Observable<Publications[]>;
  selectedAuthor: Authors;
  isEditing: boolean;

  static createPublication(): Authors {
    return {
      id: null,
      name: '',
      email: '',
      birthDate: ''
    };
  }

  constructor(
    private dataService: BackendApiService,
    public store: Store<State>,
    public fb: FormBuilder,
    private router: Router,
    private readonly notificationService: NotificationService
  ) {}

  select(authors: Authors) {
    this.isEditing = false;
    this.selectedAuthor = authors;
    this.publications$ = this.dataService.getAuthorById(authors.id);
  }

  deselect() {
    this.isEditing = false;
  }

  edit(authors: Authors) {
    this.isEditing = true;
    this.authorFormGroup.setValue(authors);
  }

  addNew(authorForm: NgForm) {
    authorForm.resetForm();
    this.authorFormGroup.reset();
    this.authorFormGroup.setValue(AuthorsComponent.createPublication());
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
  }

  delete(author: Authors) {
    //this.store.dispatch(new ActionAuthorsDeleteOne({ id: author.id }));
    this.isEditing = false;
    this.dataService.deleteAuthors(author.id).subscribe(data => {
        this.isEditing = false;
        console.log("Delete Result", data);
        this.notificationService.success(data.message);
        this.router.navigateByUrl('publications', {skipLocationChange: true}).then(()=>
          this.router.navigate(["authors"]));
      },
      error => {
        console.log("error ", error);
        this.notificationService.error(error.error.message);
        this.router.navigateByUrl('publications', {skipLocationChange: true}).then(()=>
          this.router.navigate(["authors"]));
      });

  }

  save() {
    if (this.authorFormGroup.valid) {
      const authors = this.authorFormGroup.value;
      if (authors.id) {
        this.dataService.updateAuthors(authors).subscribe(data => {
            this.isEditing = false;
            console.log("Creation Result", data);
            this.notificationService.success(data.message);
            this.router.navigateByUrl('publications', {skipLocationChange: true}).then(()=>
              this.router.navigate(["authors"]));
          },
          error => {
            console.log("error ", error);
            this.notificationService.error(error.error.message);
          });
      } else {
        this.dataService.createAuthors(authors).subscribe(data => {
            this.isEditing = false;
            console.log("Creation Result", data);
            this.notificationService.success(data.message);
            this.router.navigateByUrl('publications', {skipLocationChange: true}).then(()=>
              this.router.navigate(["authors"]));
          },
          error => {
            console.log("error ", error);
            this.notificationService.error(error.error.message);
          });
      }
    }
  }

  ngOnInit() {
    this.getAuthors()
  }

  getAuthors() {
    this.authors$ = this.dataService.getAuthors()
  }
}
