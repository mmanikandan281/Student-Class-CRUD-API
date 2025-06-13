# Student Class Management CRUD API

A comprehensive Node.js Express MongoDB CRUD API for managing students and their class information. This RESTful API provides complete functionality for creating, reading, updating, and deleting students and classes with proper validation and error handling.

## 🚀 Features

- **Complete CRUD Operations** for Students and Classes
- **RESTful API Design** with proper HTTP status codes
- **MongoDB Integration** with Mongoose ODM
- **Data Validation** using Joi validation library
- **Error Handling** with centralized error middleware
- **Pagination Support** for student listings
- **Relationship Management** between Students and Classes
- **Environment Configuration** using dotenv
- **Security Middleware** with Helmet and CORS
- **Request Logging** with Morgan
- **Professional Project Structure**

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-class-crud-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_class_db
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For macOS/Linux
sudo service mongod start
# or
mongod
```

### 5. Run the Application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
student-class-crud-api/
│
├── config/
│   └── db.js                 # Database connection configuration
│
├── controllers/
│   ├── class.controller.js   # Class-related business logic
│   └── student.controller.js # Student-related business logic
│
├── middleware/
│   └── errorHandler.js       # Global error handling middleware
│
├── models/
│   ├── class.model.js        # Class schema and model
│   └── student.model.js      # Student schema and model
│
├── routes/
│   ├── class.routes.js       # Class API routes
│   └── student.routes.js     # Student API routes
│
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── app.js                   # Express app configuration
├── package.json             # Dependencies and scripts
├── README.md                # Project documentation
└── server.js                # Server entry point
```

## 🔗 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/` | API information |

### Class Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/classes` | Create a new class |
| GET | `/api/classes` | Get all classes |
| GET | `/api/classes/:id` | Get class by ID |
| PUT | `/api/classes/:id` | Update class by ID |
| DELETE | `/api/classes/:id` | Delete class by ID |

### Student Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create a new student |
| GET | `/api/students` | Get all students (with pagination) |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id/class` | Update student's class |
| DELETE | `/api/students/:id` | Delete student by ID |
| GET | `/api/students/class/:standard/:division` | Get students by class |
| GET | `/api/students/standard/:standard` | Get students by standard |

## 📝 API Usage Examples

### Create a Class
```bash
POST /api/classes
Content-Type: application/json

{
  "standard": "10",
  "division": "A"
}
```

### Create a Student
```bash
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "rollNo": "2023001",
  "mobileNo": "9876543210",
  "classId": "64a1b2c3d4e5f6789abcdef0"
}
```

### Update Student's Class
```bash
PUT /api/students/64a1b2c3d4e5f6789abcdef0/class
Content-Type: application/json

{
  "standard": "11",
  "division": "B"
}
```

### Get Students by Class
```bash
GET /api/students/class/10/A
```

### Get Students by Standard
```bash
GET /api/students/standard/10
```

## 🔍 Data Models

### Class Model
```javascript
{
  _id: ObjectId,
  standard: String (required),
  division: String (required, uppercase),
  createdAt: Date,
  updatedAt: Date,
  fullClassName: String (virtual)
}
```

### Student Model
```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  rollNo: String (required, unique),
  mobileNo: String (required, 10 digits),
  classId: ObjectId (required, ref: 'Class'),
  createdAt: Date,
  updatedAt: Date
}
```

## ✅ Validation Rules

### Class Validation
- **standard**: Required, non-empty string
- **division**: Required, non-empty string (auto-uppercase)
- **Unique combination**: standard + division must be unique

### Student Validation
- **name**: Required, 2-100 characters
- **rollNo**: Required, unique across all students
- **mobileNo**: Required, valid 10-digit Indian mobile number (starts with 6-9)
- **classId**: Required, must reference an existing class

## 🛡️ Error Handling

The API implements comprehensive error handling:

- **400 Bad Request**: Validation errors, malformed requests
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate data (roll numbers, class combinations)
- **500 Internal Server Error**: Server-side errors

All error responses follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

### Adding New Features
1. Create/modify models in `models/` directory
2. Add business logic in `controllers/` directory
3. Define routes in `routes/` directory
4. Update validation schemas as needed
5. Test thoroughly with Postman or similar tools

## 🧪 Testing with Postman

![image](https://github.com/user-attachments/assets/2dbddf16-b6a8-4a59-9e57-7e3585547581)


Import the provided Postman collection `Student-Class-CRUD-API.postman_collection.json` to test all endpoints. The collection includes:

- Pre-configured requests for all endpoints
- Example request bodies
- Environment variables for base URL
- Test scripts for response validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙋‍♂️ Support

If you have any questions or issues, please:
1. Check the existing documentation
2. Search through existing issues
3. Create a new issue with detailed information

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Configure proper security headers
4. Set up process monitoring (PM2, etc.)
5. Use reverse proxy (Nginx) for better performance

---

**Happy Coding! 🎉**
