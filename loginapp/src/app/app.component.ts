import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  welcome = 'anonymous';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<string>('http://localhost:4200/api/v1/me')
      .subscribe((t) => (this.welcome = t));
  }
}
