import { createSelector } from '@ngrx/store';

import { selectRouterState } from '@app/core';

import { selectComponent, ComponentsState } from '../app.state';

import { authorAdapter } from './publications.reducer';

const { selectEntities, selectAll } = authorAdapter.getSelectors();

export const selectPublications = createSelector(
  selectComponent,
  (state: ComponentsState) => state.publications
);

export const selectAllPublications = createSelector(selectPublications, selectAll);
export const selectPublicationsEntities = createSelector(selectPublications, selectEntities);

export const selectSelectedPublication = createSelector(
  selectPublicationsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
