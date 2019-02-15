import { Action } from '@ngrx/store';
import { Authors } from './authors.model';

export enum AuthorsActionTypes {
  UPSERT_ONE = '[Authors] Upsert One',
  DELETE_ONE = '[Authors] Delete One'
}

export class ActionAuthorsUpsertOne implements Action {
  readonly type = AuthorsActionTypes.UPSERT_ONE;
  constructor(readonly payload: { authors: Authors }) {}
}

export class ActionAuthorsDeleteOne implements Action {
  readonly type = AuthorsActionTypes.DELETE_ONE;
  constructor(readonly payload: { id: string }) {}
}

export type AuthorsActions = ActionAuthorsUpsertOne | ActionAuthorsDeleteOne;
