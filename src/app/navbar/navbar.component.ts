import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],  // ✅ Import RouterModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // ✅ Fixed incorrect key `styleUrl` to `styleUrls`
})
export class NavbarComponent {
  
  refreshPage() {
    window.location.reload(); // ✅ Refresh the page when called
  }
}
