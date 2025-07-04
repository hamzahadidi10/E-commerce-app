import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , CommonModule , Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}