import { Component, OnInit } from '@angular/core';
import { DataService, Details } from 'src/app/data.service';
import { FormBuilder, Validators } from '@angular/forms';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';
import { HttpApiService } from 'src/app/http-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  submitted = false;
  showTerms: boolean = false;
  headerThemes = HeaderTheme;
  contactForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
  });
  files: Array<any> = [];
  checkTerms = false;
  checkTermsError = false;
  showImageError = false;
  loading = false;

  get form() { return this.contactForm.controls; }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: HttpApiService,
  ) { }

  ngOnInit(): void {
    if (this.checkTerms) {
      this.checkTermsError = false;
    }
  }
  getFiles($event: Array<any>) {
    this.files = $event;
  }
  async submit() {
    this.submitted = true;
    if (!this.checkTerms) {
      this.checkTermsError = true;
      return;
    }
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }
    if (this.files.length === 0) {
      this.showImageError = true;
      return;
    }
    let payload: Details = { ...this.contactForm.value };
    let base64Images: { name: string, url: string }[] = [];
    for (let i = 0; i < this.files.length; i++) {
      base64Images.push({ name: this.files[i].name, url: (await this.getBase64(this.files[i])) as string });
    }
    this.loading = true;
    this.apiService.contactUs(payload, this.files).subscribe((res) => {
      console.log('Response: ', res);
      this.loading = false;
      this.redirectTo('contact-us');
    }, err => this.loading = false);
  }
  getBase64(image: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}
