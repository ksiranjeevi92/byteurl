import { Component } from '@angular/core';
import { InputComponent, SHARED } from '../../../../shared';

@Component({
  selector: 'app-login',
  imports: [SHARED, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
