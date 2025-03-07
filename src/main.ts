import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appRoutes } from './app/app.routes'; // ✅ Ensure correct route file is imported

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule) // ✅ FIX: Ensure HttpClient is provided globally
  ]
})
.catch(err => console.error(err));
