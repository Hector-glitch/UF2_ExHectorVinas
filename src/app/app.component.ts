import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UF2ExHectorVinas';

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:3080/assig').subscribe((result: any) => {
    console.log(result);
  });
  }

}
