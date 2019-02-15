import { createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/core';

import { AuthorsState } from './authors/authors.model';
import { PublicationsState } from './publications/publications.model';

export const FEATURE_NAME = 'components';
export const selectComponent = createFeatureSelector<State, ComponentsState>(
  FEATURE_NAME
);

export interface ComponentsState {
  authors: AuthorsState;
  publications: PublicationsState
}

export interface State extends AppState {
  components: ComponentsState;
}
