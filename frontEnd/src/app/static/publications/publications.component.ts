import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {v4 as uuid} from 'uuid';

import {NotificationService, ROUTE_ANIMATIONS_ELEMENTS} from '@app/core';

import {Publication} from './publications.data';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, NgForm} from '@angular/forms';
import {ActionPublicationsDeleteOne, ActionPublicationsUpsertOne} from './publications.actions';
import {Router} from '@angular/router';
import {State} from '../app.state';
import {BackendApiService} from '@app/services/backend-api.service';
import {Authors} from "@app/static/authors/authors.data";

@Component({
  selector: 'sweatworks-features',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicationComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  publicationFormGroup = this.fb.group(PublicationComponent.createPublication());
  publications$: Observable<Publication[]>;
  authors$: Observable<Authors[]>;
  selectedPublication: Publication;

  isEditing: boolean;

  static createPublication(): Publication {
    return {
      id: null,
      title: '',
      author: '',
      body: '',
      createdDateTime: ''
    };
  }

  constructor(
    private dataService: BackendApiService,
    public store: Store<State>,
    public fb: FormBuilder,
    private router: Router,
    private readonly notificationService: NotificationService
  ) {
  }

  select(publication: Publication) {
    this.isEditing = false;
    this.selectedPublication = publication;
  }

  deselect() {
    this.isEditing = false;
  }

  edit(publication: any) {
    this.isEditing = true;
    console.log("puyb ",publication)
    if (publication.authorId) {
      delete publication.authorId;
      this.publicationFormGroup.setValue(publication);
    } else {
      this.publicationFormGroup.setValue(publication);
    }
  }

  addNew(publicationForm: NgForm) {
    publicationForm.resetForm();
    this.publicationFormGroup.reset();
    this.publicationFormGroup.setValue(PublicationComponent.createPublication());
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
  }

  delete(publication: Publication) {
    //this.store.dispatch(new ActionAuthorsDeleteOne({ id: author.id }));
    this.isEditing = false;
    this.dataService.deletePublication(publication.id).subscribe(data => {
        this.isEditing = false;
        console.log("Delete Result", data);
        this.notificationService.success(data.message);
        this.router.navigateByUrl('authors', {skipLocationChange: true}).then(() =>
          this.router.navigate(["publications"]));
      },
      error => {
        console.log("error ", error);
        this.notificationService.error(error.error.message);
        this.router.navigateByUrl('authors', {skipLocationChange: true}).then(() =>
          this.router.navigate(["publications"]));
      });
  }

  save() {
    if (this.publicationFormGroup.valid) {
      const publications = this.publicationFormGroup.value;
      if (publications.id) {
        this.dataService.updatePublication(publications).subscribe(data => {
            this.isEditing = false;
            console.log("Creation Result", data);
            this.notificationService.success(data.message);
            this.router.navigateByUrl('authors', {skipLocationChange: true}).then(() =>
              this.router.navigate(["publications"]));
          },
          error => {
            console.log("error ", error);
            this.notificationService.error(error.error.message);
          });
      } else {
        publications.authorId = publications.author.id;
        console.log("publications ", publications)
        this.dataService.createPublication(publications).subscribe(data => {
            this.isEditing = false;
            console.log("Creation Result", data);
            this.notificationService.success(data.message);
            this.router.navigateByUrl('authors', {skipLocationChange: true}).then(() =>
              this.router.navigate(["publications"]));
          },
          error => {
            console.log("error ", error);
            this.notificationService.error(error.error.message);
          });
      }
    }
  }

  sort(){

  }

  ngOnInit() {
    this.getPageInfo()
  }

  getPageInfo() {
    this.publications$ = this.dataService.getPublications();
    this.authors$ = this.dataService.getAuthors();
  }

  getAuthorInfo(publication) {
    this.authors$.subscribe(data => {
      publication.author = data.find(x => x.id === publication.authorId);
      return publication;
    })
  }
}
