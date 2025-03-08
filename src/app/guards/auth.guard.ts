import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if the user is logged in by verifying the presence of an auth token
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    if (!isLoggedIn) {
      // Redirect to the login page if the user is not logged in
      this.router.navigate(['/login']);
      return false;
    }

    // Allow access if the user is logged in
    return true;
  }
}