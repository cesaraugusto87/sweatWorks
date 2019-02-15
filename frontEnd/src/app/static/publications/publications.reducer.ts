import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Publications, PublicationsState } from './publications.model';
import { PublicationsActionTypes, PublicationsActions } from './publications.actions';

export function sortByTitle(a: Publications, b: Publications): number {
  return a.author.localeCompare(b.createdDateTime);
}

export const authorAdapter: EntityAdapter<Publications> = createEntityAdapter<Publications>({
  sortComparer: sortByTitle
});

export const initialState: PublicationsState = authorAdapter.getInitialState({
  id: '',
  title: '',
  author: '',
  body: '',
  createdDateTime: ''
});

export function publicationsReducer(
  state: PublicationsState = initialState,
  action: PublicationsActions
): PublicationsState {
  switch (action.type) {
    case PublicationsActionTypes.UPSERT_ONE:
      return authorAdapter.upsertOne(action.payload.publications, state);

    case PublicationsActionTypes.DELETE_ONE:
      return authorAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
