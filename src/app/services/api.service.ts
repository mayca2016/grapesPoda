import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  }; 
  
  // API path
  base_path = 'https://app.moyca.net/grapespga/RestServerPoda';
  constructor(
    private http: HttpClient
  ) {
    axios.defaults.baseURL ='https://app.moyca.net/grapespga/RestServerPoda'
   }
  // Http Options
  
   // Handle API errors
   handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
 
 
  // Create a new item
  createItem(item): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.base_path+'/prueba', JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
 
  // Get single student data by ID
  getItem(id): Observable<Usuario> {
    return this.http
      .get<Usuario>(this.base_path + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
 
  // Get students data
  getList(): Observable<Usuario> {
    return this.http
      .get<Usuario>(this.base_path)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
 
  // Update item by id
  updateItem(id, item): Observable<Usuario> {
    return this.http
      .put<Usuario>(this.base_path + '/' + id, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
 
  // Delete item by id
  deleteItem(id) {
    return this.http
      .delete<Usuario>(this.base_path + '/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  login(item):Observable<Usuario>{
    let url = '/prueba'

    
    let observable = Observable.create( ( observer ) => {
      axios.post( url, {item} )
      .then( ( response ) => {
        console.log(response);
          observer.next( response.data.data );
          observer.complete();
        })
      .catch( ( error ) => {
          observer.error( error );
        });
      }
    );
    return observable
  }
}
