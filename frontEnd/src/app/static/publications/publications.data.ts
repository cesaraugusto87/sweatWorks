import { environment as env } from '@env/environment';

export interface Publication {
  id: string
  title: string,
  author: string,
  body: string,
  createdDateTime: string
}

export const publications: Publication[] = [];
