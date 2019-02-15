import { EntityState } from '@ngrx/entity';

export interface Authors {
  id: string;
  name: string;
  email: string;
  birthDate: string;
}

export interface AuthorsState extends EntityState<Authors> {}
