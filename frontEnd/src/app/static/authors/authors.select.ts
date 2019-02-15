import { createSelector } from '@ngrx/store';

import { selectRouterState } from '@app/core';

import { selectComponent, ComponentsState } from '../app.state';

import { authorAdapter } from './authors.reducer';

const { selectEntities, selectAll } = authorAdapter.getSelectors();

export const selectAuthors = createSelector(
  selectComponent,
  (state: ComponentsState) => {
    console.log("state ",state)
    return state.authors
  }
);

export const selectAllAuthors = createSelector(selectAuthors, selectAll);
export const selectAuthorsEntities = createSelector(selectAuthors, selectEntities);

export const selectSelectedBook = createSelector(
  selectAuthorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
