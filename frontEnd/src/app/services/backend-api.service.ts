import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private http: HttpClient) { }

  getPublications(): Observable<any> {
    return this.http.get(environment.baseUrl + '/publication');
  }
  getPublicationsBySearch(search: any): Observable<any> {
    return this.http.get(environment.baseUrl + '/publication?title='+search);
  }
  getAuthorById(id: string): Observable<any> {
    return this.http.get(environment.baseUrl + '/author/'+id);
  }
  createPublication(custReqObj: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.baseUrl + '/publication', JSON.stringify(custReqObj), { headers: headers });
  }
  updatePublication(custReqObj: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(environment.baseUrl + '/publication/'+custReqObj.id, JSON.stringify(custReqObj), { headers: headers });
  }
  deletePublication(id: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.delete(environment.baseUrl + '/publication/'+ id, { headers: headers });
  }


  getAuthors(): Observable<any> {
    return this.http.get(environment.baseUrl + '/author');
  }
  createAuthors(custReqObj: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.baseUrl + '/author', JSON.stringify(custReqObj), { headers: headers });
  }
  updateAuthors(custReqObj: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(environment.baseUrl + '/author/'+custReqObj.id, JSON.stringify(custReqObj), { headers: headers });
  }
  deleteAuthors(id: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.delete(environment.baseUrl + '/author/'+ id, { headers: headers });
  }

}
