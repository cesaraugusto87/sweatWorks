import { environment as env } from '@env/environment';

export interface Authors {
  id: string,
  name: string,
  email: string,
  birthDate: string
}

export const authors: Authors[] = [];
