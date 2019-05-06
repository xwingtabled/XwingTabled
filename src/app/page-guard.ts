import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { XwingDataService } from './services/xwing-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PageGuard implements CanActivate {


    constructor(private dataService: XwingDataService, private router: Router) {
    }
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.dataService.initialized) {
          return true;
      }
      // navigate to main page
      this.router.navigate(['/']);
      
      return false;
    }
  
  }