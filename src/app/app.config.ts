import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig = [provideHttpClient(withInterceptorsFromDi())];
