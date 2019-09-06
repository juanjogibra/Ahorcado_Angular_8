import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServicioPalabrasService {

  constructor(private http: HttpClient) { }

  getPost() {
    return this.http.get('https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/palabras.json')
  }
}


