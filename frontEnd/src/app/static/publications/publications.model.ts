import { EntityState } from '@ngrx/entity';

export interface Publications {
  id: string;
  title: string;
  author: string;
  body: string;
  createdDateTime: string;
}

export interface PublicationsState extends EntityState<Publications> {}
