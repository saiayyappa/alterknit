import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Details } from './data.service';

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
    // this.APIURL = "https://ahb3ekuqf4.execute-api.us-east-1.amazonaws.com";
    // this.APIURL = "http://localhost:3003";
  }

  createOrder(payload: any): Observable<any> {
    return <Observable<any>>this.httpClient.post(this.APIURL + '/dev/order', payload);
    // return <Observable<any>>this.httpClient.post(this.APIURL + '/dev/hello', {
    //   "name": "Sai"
    // });
    // return <Observable<any>>this.httpClient.get(this.APIURL + '/dev/order');
  }

  contactUs(info: Details, images: File[]): Observable<any> {
    // images: { name: string, url: string }[]
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('fileArray', images[i], images[i].name);
    }
    formData.append('firstName', info.firstName);
    formData.append('lastName', info.lastName);
    formData.append('email', info.email);
    formData.append('phone', info.phone);
    return this.httpClient.post(this.APIURL + '/dev/contact-us', formData);
  }
}
