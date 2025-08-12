import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersServices } from '../../services/users-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  userValid: boolean = true;
  userWarning: string = '';
  emailValue: string = '';
  emailValid: boolean = true;
  passwordValid: boolean = true;

  constructor (private usersServices: UsersServices) {}

  register(username: string, email: string, password: string, confpassword: string) {
    if (!this.validateUserInput(username)) {
      this.swalMessage('Error', this.userWarning, 'error')
      return
    }
    if (!this.validateEmail(email)) {
      this.swalMessage('Error', "Ingresa un correo válido; Ejemplo: user@gmail.com", 'error')
      return

    }
    if (!this.validatePassword(password)) {
      this.swalMessage('Error', "La contraseña debe contener por lo menos un numero y un caracter especial", 'error')
      return
    }
    if (!this.confirmedPassword(password, confpassword)) {
      this.swalMessage('Error', 'Las contraseñas deben coincidir', 'error')
      return
    }
    this.usersServices.registerUser(username, email, password).subscribe({
      next: (response) => {
        if (response.status == 201) {
          this.swalMessage('Succes', 'Registro exitoso 😄', 'success')
        }
      },
      error: (error) => {
        this.swalMessage('Error', error.error.message, 'error')
      }
    })
  }

  validateUserInput(username: string) {
    if (/\s/.test(username)) {
      this.userWarning = 'EL usuario no puede contener espacios en blanco'
      this.userValid = false
      return false
    }
    else if (!username) {
      this.userWarning = 'El usuario es obligatorio'
      this.userValid = false
      return false
    }
    return true
  }

  confirmedPassword(confirmPassword: string, password: string) {
    if (password !== confirmPassword) {
      return false
    }
    return true
  }

  validatePassword(password: string) {
    if (!password || password.trim() === '' || /\s/.test(password)) {
      this.passwordValid = false
      return false
    }

    if (!/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      this.passwordValid = false
      return false
    }
    return true
  }

  validateEmail(email: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.emailValid = false
      return false
    }
    return true
  }

  noSpaces(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
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
