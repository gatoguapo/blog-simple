import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Blog as BlogModel } from '../../models/blog';
import { CommonModule } from '@angular/common';
import { BlogsServices } from '../../services/blogs-services';
import { FollowersServices } from '../../services/followers-services';
import Swal from 'sweetalert2';
import { EditBlog } from '../edit-blog/edit-blog';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, EditBlog],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css'
})
export class BlogCard {
  editBlogModal:boolean = false;
  @Input() userPictureUrl: string = '';
  @Input() username: string = '';
  @Input() blogData!: BlogModel;
  @Input() isHome: boolean = false;
  @Output() isEdited = new EventEmitter<void>();
  @Output() isDeleted = new EventEmitter<void>();
  isFollowing: WritableSignal<boolean | null> = signal(null);

  constructor (private blogsServices: BlogsServices, private folowersServices: FollowersServices) {}

  ngOnInit(): void {
    this.checkFollower(this.blogData.user_id);
  }

  checkFollower(userId: number): void {
    const followerId = localStorage.getItem('id');

    this.folowersServices.searchFollow(userId, Number(followerId)).subscribe({
      next: response => {
        this.isFollowing.set(response.follow);
        console.log(this.isFollowing)
      },
      error: error => {
        this.swalMessage("error", error.error.message, "error");
        this.isFollowing.set(false);
      }
    });
  }

  deleteBlog(id: number) {
    this.blogsServices.deleteBlog(id).subscribe({
      next: response => {
        this.isDeleted.emit();
      },
      error: error => {
        this.swalMessage('Error', error.message, 'error');
      }
    });
  }

  followUser(user_id: number) {
    const follower_id= localStorage.getItem('id')
    this.folowersServices.followUser(user_id, Number(follower_id)).subscribe({
      next: response => {
        if (response.status === 201) {
          this.swalMessage("success", "Usuario seguido exitosamente", "success")
        }
      },
      error: error => {
        this.swalMessage("error", error.error.message, "error")
      }
    })
  }

  getImageUrl(pictureUrl: string): string {
    return `http://localhost:5000/${pictureUrl}`;
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
}
