# 📌 angular-tracker-manaher-ui

## 📌 Project Overview
This is an Angular-based application designed to track work items such as car mileage logs, car expenses, medical records, and more. The project follows the latest Angular standards and uses Bootstrap for styling.

## 🚀 Features
- User Registration
- User Login
- Admin Control Panel
- Work Item Tracking
- Responsive UI with Bootstrap

## 🛠️ Technologies Used
- **Frontend**: Angular (latest), TypeScript, Bootstrap
- **Backend**: Spring Boot (latest), Java 21, PostgreSQL, Liquibase
- **Build Tool**: Gradle

## 📂 Project Structure
```
angular-tracker-manager-ui/
│── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│── angular.json
│── package.json
│── README.md
```

## 🔧 Installation & Setup
### 1️⃣ Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- Angular CLI (`npm install -g @angular/cli`)
- Git

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/angular-tracker-manager-ui.git
cd angular-tracker-manager-ui
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Run the Development Server
```sh
ng serve
```
- The app will be available at: `http://localhost:4200/`

## 🚀 Building the Project
To generate a production build, run:
```sh
ng build --configuration=production
```
The output files will be in the `dist/` folder.

## ✅ Code Quality & Formatting
This project follows best practices:
- **Linting**: Run `ng lint` to check for linting issues.
- **Formatting**: Use Prettier (`npm run format`).

## 🔗 Important Commands
| Command                 | Description                            |
|-------------------------|----------------------------------------|
| `ng serve`             | Start the development server           |
| `ng build`             | Create a production build              |
| `ng lint`              | Run linting checks                     |
| `ng test`              | Run unit tests                         |
| `ng e2e`               | Run end-to-end tests                   |

## 🔥 Contributing
Contributions are welcome! Please follow the standard GitHub workflow:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

## 📜 License
This project is licensed under the MIT License.

----

## Commands

-	ng new angular-tracker-manager-ui --routing --style=css
-	npm install bootstrap
-	npm install bootstrap-icons
