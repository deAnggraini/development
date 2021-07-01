import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { CommonHttpResponse } from '../http-response';
import { environment } from 'src/environments/environment';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient, private toast: ToastService) { }

  getHeaders(json: boolean = true) {
    let token = 'empty';
    let username = 'empty';
    const str = localStorage.getItem(this.authLocalStorageToken);
    if (str) {
      const auth: AuthModel = JSON.parse(str);
      token = `Bearer ${auth.authToken}`;
      username = auth.username
    }
    const headers = new HttpHeaders({
      'Authorization': token,
      'X-USERNAME': username
    });
    if (json) {
      headers.append('Content-Type', 'application/json');
    }
    return { headers };
  }

  post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    return this.http.post(url, body, options == null ? this.getHeaders() : options).pipe(
      concatMap((res: CommonHttpResponse) => {
        if (res.error && res.error !== '00') throw Error(res.msg);
        if (res.status && res.status.error !== '00') throw Error(res.msg);
        const { data, paging } = res;
        if (paging) return of({ data, paging });
        return of(data);
      }),
      catchError((err) => {
        console.error('ApiService', err);
        setTimeout(() => this.toast.showDanger(err.message), 0);
        throw err.message;
        return of(undefined);
      }),
    );
  }

  get(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    return this.http.get(url, options == null ? this.getHeaders() : options).pipe(
      concatMap((res: CommonHttpResponse) => {
        if (res.error && res.error !== '00') throw Error(res.msg);
        if (res.status && res.status.error !== '00') throw Error(res.msg);
        const { data, paging } = res;
        if (paging) return of({ data, paging });
        return of(data);
      }),
      catchError((err) => {
        console.error('ApiService', err);
        return of(undefined);
      }),
    );
  }
}