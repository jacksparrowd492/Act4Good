// sidebar.component.ts

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrected property name
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
      }
    }
  }

  @Output() contentLoad = new EventEmitter<string>();

  loadContent(page: string): void {
    this.contentLoad.emit(page);
  }
}