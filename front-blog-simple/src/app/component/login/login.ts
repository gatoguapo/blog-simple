import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsersServices } from '../../services/users-services';
import Swal from 'sweetalert2';

interface User {
  id: number,
  username: string,
  email: string,
  picture_url: string,
  bgimage_url: string
}

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor (private userServices: UsersServices, private router: Router) {}

  login(username: string, password: string) {
    this.userServices.login(username, password).subscribe({
      next: (response) => {
        localStorage.setItem("id", response.body.user.id)
        localStorage.setItem("username", response.body.user.username)
        this.router.navigate([`/${response.body.user.username}`]);

      },
      error: (error) => {
        this.swalMessage('Error', error.error.message, 'error')
      }
    })
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
