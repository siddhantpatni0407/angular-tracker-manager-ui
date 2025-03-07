import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appRoutes } from './app/app.routes'; // ✅ Ensure correct route file is imported

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()), // ✅ Fix: Ensure input binding for route params
    importProvidersFrom(HttpClientModule) // ✅ Fix: Ensure HttpClient is globally available
  ]
})
.catch(err => console.error('🔥 Bootstrap error:', err));
