import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersServices {
  private apiUrl = 'http://localhost:5000'
  constructor(private http:HttpClient) {}

  registerUser(username: string, email: string, password: string):Observable<any> {
    return this.http.post(`${this.apiUrl}/users`,
      { username, email, password },
      { observe: 'response' }
    )
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      observe: 'response'
    })
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/login`, {
      params: {username, password},
      observe: 'response'
    })
  }

  updateProfilePicture(user_id: number, image: File | null): Observable<any> {
    const formData = new FormData()
    formData.append('id', user_id.toString())
    if (image) {
      formData.append('image', image);
    }

    return this.http.put(`${this.apiUrl}/users/picture`, formData, {
      observe: 'response'
    })
  }

  updateBGImage(user_id: number, image: File | null): Observable<any> {
    const formData = new FormData()
    formData.append('id', user_id.toString())
    if (image) {
      formData.append('image', image);
    }

    return this.http.put(`${this.apiUrl}/users/bgImage`, formData, {
      observe: 'response'
    })
  }
}
