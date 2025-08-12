import { Component, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersServices } from '../../services/users-services';
import { BlogsServices } from '../../services/blogs-services';
import { User as UserModel } from '../../models/user'
import { Blog as BlogModel } from '../../models/blog';
import { SearchBar } from '../search-bar/search-bar';
import { CommonModule } from '@angular/common';
import { BlogCard } from '../blog-card/blog-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SearchBar, BlogCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  userData$!: Observable<any>;
  blogsData$!: Observable<any>;
  user:UserModel | null = null;
  blogs:BlogModel[] = [];
  username = '';
  userPicture = ''

  constructor(private userServices: UsersServices, private blogsServices: BlogsServices, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getUserData()
    this.getBlogs()
  }

  getUserData() {
    const id = localStorage.getItem('id');
      this.userData$ = this.userServices.getUser(Number(id));
      this.userData$.subscribe({
        next: response => {
          const data = response.body
          this.user = {
            id: Number(id),
            username: data.username,
            description: data.description,
            bgImageUrl: data.bgimage_url,
            picture_url: data.picture_url
          }
          this.cdr.detectChanges();
        },
        error: err => {
          this.swalMessage('Error', err, 'error')
        }
    });
  }

  getBlogs() {
    const id = localStorage.getItem('id');
    this.blogsData$ = this.blogsServices.getBlogs(Number(id));
    this.blogsData$.subscribe({
      next: response => {
        this.blogs = response.body.blogs;
        this.cdr.detectChanges();
      },
      error: error => {
        this.swalMessage('Error', error, 'error')
      }
    });
  }

  swalMessage(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question'): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Ok',
      draggable: true
    });
  }

  getImageUrl(pictureUrl: string): string {
    return `http://localhost:5000/${pictureUrl}`;
  }
}
