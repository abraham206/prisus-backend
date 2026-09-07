Prius Backend API

A backend API for an AI-powered study platform that allows users to upload study documents, extract their text content, and generate educational materials such as quizzes and flashcards using an AI API.

🚀 Features

- User authentication and authorization
- Secure password handling
- JWT-based authentication
- User registration and login
- Upload study documents
- Support for PDF and Word documents
- Extract text from uploaded documents
- AI-powered quiz generation
- AI-powered flashcard generation
- Quiz management
- Quiz history 
- Flashcards history
- Edit user data.
- User-related functionality
- Error handling
- Protected routes
- Environment variable configuration
- validation with zod
- Rate limiting

📄 Supported Documents

The application can process:

- PDF (".pdf")
- Microsoft Word (".doc")
- Microsoft Word (".docx")
- Text documents (".txt")

Uploaded documents are processed temporarily and are not intended for permanent storage.

🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- pdf-parse
- Mammoth
- Word Extractor
- zod
- AI API
- openAI
- express-rate-limiter


⚙️ Installation

Clone the repository:

git clone https://github.com/abraham206/prius-backend.git

Navigate into the project:

cd prius-backend

Install dependencies:

npm install

🔐 Environment Variables

Create a "config.env" file in the root directory.

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_ai_api_key

▶️ Running the Application

Start the application:

npm start

For development, if configured:

npm run dev

The server should start on:

http://localhost:5000

🔄 Application Flow

User
↓
Upload Document
↓
Multer
↓
Text Extraction
↓
AI API
↓
Quiz / Flashcard Generation
↓
Return Generated Study Material

🔒 Security

Sensitive information such as database connection strings, JWT secrets, and AI API keys are stored using environment variables and excluded from version control using ".gitignore".

Ignored files include:

node_modules/
config.env
document/

🌐 Deployment

The backend is designed to be deployed as a web service.

Recommended deployment stack:

- Backend: Render
- Database: MongoDB Atlas
- Frontend: Netlify
- Version Control: GitHub

📌 Future Improvements

- User dashboard improvements
- Document processing improvements
- Improved AI response validation
- Better error handling
- Email verification
- Password reset functionality
- Deployment monitoring
