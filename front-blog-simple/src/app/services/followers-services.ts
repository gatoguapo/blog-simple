import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowersServices {
  private apiUrl = 'http://localhost:5000'
  constructor(private http:HttpClient) {}

  followUser(user_id: number, follower_id: number):Observable<any> {
    return this.http.put(`${this.apiUrl}/followers`,
      { user_id, follower_id },
      { observe: 'response' }
    )
  }

  searchFollow(user_id: number, follower_id: number):Observable<any> {
    const params = new HttpParams()
    .set('user_id', user_id.toString())
    .set('follower_id', follower_id.toString());

    return this.http.get(`${this.apiUrl}/search_follower`, { params });
  }
}
