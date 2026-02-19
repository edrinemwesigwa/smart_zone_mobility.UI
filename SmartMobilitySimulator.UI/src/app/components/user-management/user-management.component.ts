import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { getApiBase } from "../../services/api-base";
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}

interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-management">
      <div class="page-header">
        <h1>👥 User Management</h1>
        <p>Manage system users and their roles</p>
      </div>

      <!-- Create New User Section -->
      <div class="create-user-card">
        <h2>➕ Create New User</h2>
        <form
          (ngSubmit)="createUser()"
          #createForm="ngForm"
          class="create-form"
        >
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input
                type="text"
                [(ngModel)]="newUser.firstName"
                name="firstName"
                required
                placeholder="John"
              />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input
                type="text"
                [(ngModel)]="newUser.lastName"
                name="lastName"
                required
                placeholder="Doe"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="newUser.email"
                name="email"
                required
                placeholder="john@authority.ae"
              />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                [(ngModel)]="newUser.password"
                name="password"
                required
                minlength="6"
                placeholder="Min 6 characters"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Role</label>
              <select [(ngModel)]="newUser.role" name="role" required>
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label>&nbsp;</label>
              <button
                type="submit"
                [disabled]="isCreating || !createForm.valid"
                class="create-btn"
              >
                <span *ngIf="isCreating">Creating...</span>
                <span *ngIf="!isCreating">Create User</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Users List -->
      <div class="users-list-card">
        <div class="card-header">
          <h2>📋 Existing Users</h2>
          <button (click)="loadUsers()" class="refresh-btn">🔄 Refresh</button>
        </div>

        <div *ngIf="isLoading" class="loading">Loading users...</div>

        <div *ngIf="!isLoading && users.length === 0" class="empty-state">
          No users found. Create your first user above.
        </div>

        <table *ngIf="!isLoading && users.length > 0" class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td class="user-name">
                <div class="avatar">
                  {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                </div>
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class]="user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.isActive">
                  {{ user.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td>{{ user.createdAt | date: "dd/MM/yyyy" }}</td>
              <td>
                {{
                  user.lastLoginAt
                    ? (user.lastLoginAt | date: "dd/MM/yyyy HH:mm")
                    : "Never"
                }}
              </td>
              <td class="actions">
                <button
                  *ngIf="user.isActive"
                  (click)="deactivateUser(user.id)"
                  class="action-btn deactivate"
                  title="Deactivate"
                >
                  ⛔
                </button>
                <button
                  *ngIf="!user.isActive"
                  (click)="activateUser(user.id)"
                  class="action-btn activate"
                  title="Activate"
                >
                  ✅
                </button>
                <button
                  (click)="deleteUser(user.id)"
                  class="action-btn delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .user-management {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
      }

      .page-header p {
        color: #64748b;
        margin: 0;
      }

      .create-user-card,
      .users-list-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .create-user-card h2,
      .users-list-card h2 {
        font-size: 1.25rem;
        color: #1e293b;
        margin: 0 0 1.5rem 0;
      }

      .create-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-row {
        display: flex;
        gap: 1rem;
      }

      .form-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #475569;
      }

      .form-group input,
      .form-group select {
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.95rem;
        transition: border-color 0.2s;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #0d47a1;
      }

      .create-btn {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #0d47a1, #1565c0);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .create-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(13, 71, 161, 0.3);
      }

      .create-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .card-header h2 {
        margin: 0;
      }

      .refresh-btn {
        padding: 0.5rem 1rem;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .refresh-btn:hover {
        background: #e2e8f0;
      }

      .users-table {
        width: 100%;
        border-collapse: collapse;
      }

      .users-table th,
      .users-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }

      .users-table th {
        font-weight: 600;
        color: #64748b;
        font-size: 0.875rem;
        text-transform: uppercase;
      }

      .users-table td {
        color: #1e293b;
      }

      .user-name {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0d47a1, #1565c0);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .role-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .role-badge.admin {
        background: #fef3c7;
        color: #92400e;
      }

      .role-badge.editor {
        background: #dbeafe;
        color: #1e40af;
      }

      .role-badge.viewer {
        background: #f1f5f9;
        color: #475569;
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        background: #fee2e2;
        color: #991b1b;
      }

      .status-badge.active {
        background: #dcfce7;
        color: #166534;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .action-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s;
      }

      .action-btn:hover {
        background: #f1f5f9;
      }

      .action-btn.delete:hover {
        background: #fee2e2;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #64748b;
      }

      @media (max-width: 768px) {
        .form-row {
          flex-direction: column;
        }

        .users-table {
          font-size: 0.875rem;
        }

        .users-table th,
        .users-table td {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  private apiUrl = `${getApiBase()}/api/auth`;

  users: User[] = [];
  isLoading = false;
  isCreating = false;

  newUser: CreateUserRequest = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "Viewer",
  };

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.show(
          error.error?.message || "Failed to load users",
          "error",
        );
      },
    });
  }

  createUser(): void {
    this.isCreating = true;
    this.http.post<User>(`${this.apiUrl}/register`, this.newUser).subscribe({
      next: () => {
        this.toastService.show("User created successfully!", "success");
        this.newUser = {
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "Viewer",
        };
        this.isCreating = false;
        this.loadUsers();
      },
      error: (error) => {
        this.isCreating = false;
        this.toastService.show(
          error.error?.message || "Failed to create user",
          "error",
        );
      },
    });
  }

  activateUser(userId: number): void {
    this.http
      .put(`${this.apiUrl}/users/${userId}/status`, { isActive: true })
      .subscribe({
        next: () => {
          this.toastService.show("User activated!", "success");
          this.loadUsers();
        },
        error: (error) => {
          this.toastService.show(
            error.error?.message || "Failed to activate user",
            "error",
          );
        },
      });
  }

  deactivateUser(userId: number): void {
    this.http
      .put(`${this.apiUrl}/users/${userId}/status`, { isActive: false })
      .subscribe({
        next: () => {
          this.toastService.show("User deactivated!", "success");
          this.loadUsers();
        },
        error: (error) => {
          this.toastService.show(
            error.error?.message || "Failed to deactivate user",
            "error",
          );
        },
      });
  }

  deleteUser(userId: number): void {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    this.http.delete(`${this.apiUrl}/users/${userId}`).subscribe({
      next: () => {
        this.toastService.show("User deleted!", "success");
        this.loadUsers();
      },
      error: (error) => {
        this.toastService.show(
          error.error?.message || "Failed to delete user",
          "error",
        );
      },
    });
  }
}
