import type { CanActivateFn } from '@angular/router';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const role = sessionStorage.getItem('role');
  if(role != 'level 1'){
    return true;
  }
  else{
    return false;
  }
};
