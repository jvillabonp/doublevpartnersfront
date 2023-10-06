import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

const apiUrl = 'https://api.github.com/';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  constructor(private httpClient: HttpClient) {}

  fetchUsername = (username: string) => {
    return this.httpClient.get<any[]>(`${apiUrl}search/users?q=${username}&per_page=100`)
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(() => console.log('Users not found', error));
        })
    );
  };

  getUser = (username: string) => {
    return this.httpClient.get<any[]>(`${apiUrl}users/${username}`)
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(() => console.log('Users not found', error));
        })
    );
  }
}
