import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogsServices {
  private apiUrl = 'http://localhost:5000'

  constructor(private http:HttpClient) {}

  postBlog(user_id: number, title: string, description: string, image: File | null): Observable<any> {
    const formData = new FormData()
    formData.append('user_id', user_id.toString())
    formData.append('title', title.toString())
    formData.append('description', description.toString())
    if (image) {
      formData.append('image', image);
    }

    return this.http.post(`${this.apiUrl}/blogs`, formData, {
      observe: 'response'
    })
  }

  getUserBlogs(user_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/blogs/${user_id}`, {
      observe: 'response'
    })
  }

  getBlogs(user_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/home/${user_id}`, {
      observe: 'response'
    })
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blogs`, {
      body: {id},
      observe: 'response'
    })
  }

  editBlog(id: number | undefined, title: string, description: string, image: File | null): Observable<any> {
    const formData = new FormData()
    if (id != undefined) {
      formData.append('id', id.toString())
      formData.append('description', description)
      formData.append('title', title)
    }
    if(image) {
      formData.append('image', image)
    }

    return this.http.put(`${this.apiUrl}/blogs`, formData, {
      observe: 'response'
    })
  }
}
