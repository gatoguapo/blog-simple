import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UsersServices } from '../../services/users-services';
import { BlogsServices } from '../../services/blogs-services';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Blog as BlogModel} from '../../models/blog';
import { SearchBar } from '../search-bar/search-bar';
import { CreateBlog } from "../create-blog/create-blog";
import { BlogCard } from '../blog-card/blog-card';
import { User as UserModel } from '../../models/user'

@Component({
  selector: 'app-blog',
  imports: [CommonModule, SearchBar, CreateBlog, BlogCard],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  standalone: true
})
export class Blog {
  userData$!: Observable<any>;
  blogsData$!: Observable<any>;
  user:UserModel | null = null;
  blogs:BlogModel[] = []
  createBlog: boolean = false;
  editBlogModal: boolean = false;
  fileSelected: File | null = null;
  fileSelectedName: string = ''
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bgFileInput') bgFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pfpFileInput') pfpFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userServices: UsersServices,
    private blogsServices: BlogsServices,
    private cdr: ChangeDetectorRef) {
      this.getUserData();
      this.getBlogsData();
  }

  ngOnInit() {
    this.getUserData()
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

  getBlogsData() {
    const id = localStorage.getItem('id');
    this.blogsData$ = this.blogsServices.getUserBlogs(Number(id));
    this.blogsData$.subscribe({
      next: response => {
        this.blogs = response.body.blogs;
        this.cdr.detectChanges();
      }
    })
  }

  onProfilePictureSelected() {
    const user_id = localStorage.getItem('id')
    if (this.pfpFileInput.nativeElement.files && this.pfpFileInput.nativeElement.files.length > 0) {
      this.fileSelected = this.pfpFileInput.nativeElement.files[0];
    }
    this.userServices.updateProfilePicture(Number(user_id), this.fileSelected).subscribe({
      next: response => {
        this.getUserData()
      },
      error: error => {
        this.swalMessage('Error', `${error.error.message}`, 'error')
      }
    })
  }

  onBGImageSelected() {
    const user_id = localStorage.getItem('id')
    if (this.bgFileInput.nativeElement.files && this.bgFileInput.nativeElement.files.length > 0) {
      this.fileSelected = this.bgFileInput.nativeElement.files[0];
    }
    this.userServices.updateBGImage(Number(user_id), this.fileSelected).subscribe({
      next: response => {
        this.getUserData();
      },
      error: error => {
        this.swalMessage('Error', `${error.error.message}`, 'error')
      }
    })
  }

  openBGImageFileInput() {
    this.bgFileInput.nativeElement.click();
  }

  onFileSelected() {
    if (this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length > 0) {
      this.fileSelected = this.fileInput.nativeElement.files[0];
      this.fileSelectedName = this.fileSelected.name
    }
  }

  openPfpFileInput() {
    this.pfpFileInput.nativeElement.click();
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
