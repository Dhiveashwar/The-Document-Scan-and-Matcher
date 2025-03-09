The Document Scan and Matcher

Project Description:

My web application is document scanning and matching system that helps users detect similarities between documents. Each user gets 20 scanning credits daily, and they can request more if needed. The system uses AI to analyze uploaded documents and find matches with other files in the database.


The Key features this includes are:

Document uploading and scanning with AI-powered matching.
Credit system with daily limits upto 20 scans per day.
More Credit request is also provided.
Admin dashboard to manage user credit requests and monitor users details.
Secure authentication with JWT

Now, Lets see the setup of this project:

1. The first step is that we have to Clone the repository by:

"git clone "

2. The second step is that we have to Install the required packages by:

"npm install express sqlite3 dotenv cors nodemon path fs cron bcrypt multer"

3. The third step is that we have to Set up your package.json scripts to include by:

"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon index.js"
}

4. The fouth step is that we have to Create a .env file in the Backend directory with these variables:

PORT = 5000
JWT_SECRET_KEY = your_generated_key
GEMINI_API_KEY = your_gemini_api_key

and also for generating a JWT key, we have to run:

"node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

5. The fifth step is that we have to Create a SQLite database by:

mkdir -p Project/Backend/src/data
cd Project/Backend/src/data
touch database.sqlite
sqlite3 database.sqlite

6. The sixth step is that we have to Set up database tables by:

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  credits INTEGER DEFAULT 20
);

CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE credit_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

7. The seventh step is that we have to Navigate to the main directory and run the following command:

"nodemon index.js"

8. The Eight step is that Access the Web Application and the port is 5000"

"http://localhost:5000/"
