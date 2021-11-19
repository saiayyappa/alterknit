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
    // staging
    this.APIURL = "https://cqe5phfo05.execute-api.us-east-1.amazonaws.com";
    // development
    // this.APIURL = "https://za6jh1g643.execute-api.us-east-1.amazonaws.com";
  }

  createOrder(payload: any): Observable<any> {
    return <Observable<any>>this.httpClient.post(this.APIURL + '/dev/order', payload);
    // return <Observable<any>>this.httpClient.post(this.APIURL + '/dev/hello', {
    //   "name": "Sai"
    // });
    // return <Observable<any>>this.httpClient.get(this.APIURL + '/dev/order');
  }
}
