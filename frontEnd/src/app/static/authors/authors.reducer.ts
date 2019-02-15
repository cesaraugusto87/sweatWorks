import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Authors, AuthorsState } from './authors.model';
import { AuthorsActionTypes, AuthorsActions } from './authors.actions';

export function sortByTitle(a: Authors, b: Authors): number {
  return a.name.localeCompare(b.birthDate);
}

export const authorAdapter: EntityAdapter<Authors> = createEntityAdapter<Authors>({
  sortComparer: sortByTitle
});

export const initialState: AuthorsState = authorAdapter.getInitialState({
  ids: ['123'],
  entities: {
    '123': {
      id: '123',
      title: 'Reactive Programming with Angular and ngrx',
      author: 'Oren Farhi',
      description:
        'Learn to Harness the Power of Reactive Programming with RxJS and ngrx Extensions'
    }
  }
});

export function authorsReducer(
  state: AuthorsState = initialState,
  action: AuthorsActions
): AuthorsState {
  switch (action.type) {
    case AuthorsActionTypes.UPSERT_ONE:
      return authorAdapter.upsertOne(action.payload.authors, state);

    case AuthorsActionTypes.DELETE_ONE:
      return authorAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
