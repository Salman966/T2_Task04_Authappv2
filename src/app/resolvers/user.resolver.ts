import { ResolveFn } from '@angular/router';
import { User } from '../models/user.model';

export const userResolver: ResolveFn<User | null> = () => {
    const userJson = localStorage.getItem('authUser');
    const user = userJson ? JSON.parse(userJson) : null;
    console.log('userResolver loaded:', user); 
    return user;
  };
  