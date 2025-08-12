import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  standalone: true
})
export class SearchBar implements OnInit, OnDestroy {
  @Input() inHome:boolean = false;
  private scrollListener: (() => void) | null = null;

  constructor (private router:Router) {}

  ngOnInit() {
    this.setupScrollListener();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  setupScrollListener() {
    const searchBar = document.querySelector('.div-search');

    if (searchBar) {
      if (this.inHome) {
        searchBar.classList.add('home');
        console.log('home')
      } else {
        searchBar.classList.remove('home');
      }

      this.scrollListener = () => {
        if (window.scrollY > 50) {
          searchBar.classList.add('scrolled');
        } else {
          searchBar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  logOut() {
    this.router.navigateByUrl('');
  }

  onInputFocus() {
    const container = document.querySelector('.container-search');
    if (container) {
      container.classList.add('focused');
    }
  }

  onInputBlur() {
    const container = document.querySelector('.container-search');
    if (container) {
      container.classList.remove('focused');
    }
  }
}
