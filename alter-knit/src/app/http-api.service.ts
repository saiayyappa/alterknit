import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  APIURL: string;
  constructor(
    private httpClient: HttpClient,
  ) {
    this.APIURL = "http://localhost:3003";
  }

  createOrder(payload: any): Observable<any> {
    return <Observable<any>>this.httpClient.post(this.APIURL + '/dev/order', payload);
  }
}
