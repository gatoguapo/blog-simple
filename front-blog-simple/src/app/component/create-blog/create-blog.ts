import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsServices } from '../../services/blogs-services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-blog',
  imports: [CommonModule],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css'
})
export class CreateBlog {
  @Input() username: string = "";
  @Input() createBlog: boolean = false;
  userId: number = 0;
  fileSelected: File | null = null;
  fileSelectedName: string = ''
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() isCreated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  constructor(private blogsServices: BlogsServices, private router: Router) {}

  postBlog(title: string, description: string) {
    const user_id = localStorage.getItem('id')
    this.blogsServices.postBlog(Number(user_id), title, description, this.fileSelected).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.closeModal.emit();
          this.isCreated.emit()
        }
      },
      error: (error) => {
        this.swalMessage('Error', `${error.error.message}`, 'error')
      }
    })
  }

  onCancel() {
    this.closeModal.emit();
  }

  onFileSelected() {
    if (this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length > 0) {
      this.fileSelected = this.fileInput.nativeElement.files[0];
      this.fileSelectedName = this.fileSelected.name
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
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
