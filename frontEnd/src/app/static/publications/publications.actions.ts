import { Action } from '@ngrx/store';
import { Publications } from './publications.model';

export enum PublicationsActionTypes {
  UPSERT_ONE = '[Publications] Upsert One',
  DELETE_ONE = '[Publications] Delete One'
}

export class ActionPublicationsUpsertOne implements Action {
  readonly type = PublicationsActionTypes.UPSERT_ONE;
  constructor(readonly payload: { publications: Publications }) {}
}

export class ActionPublicationsDeleteOne implements Action {
  readonly type = PublicationsActionTypes.DELETE_ONE;
  constructor(readonly payload: { id: string }) {}
}

export type PublicationsActions = ActionPublicationsUpsertOne | ActionPublicationsDeleteOne;
