import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { XwingStateService } from './services/xwing-state.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalGuard implements CanActivate {


    constructor(private state: XwingStateService, private router: Router) {
    }
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.state.initialized) {
          return true;
      }
  
      // navigate to main page
      this.router.navigate(['/']);
      
      return false;
    }
  
  }