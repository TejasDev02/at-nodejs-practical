import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser'; // For handling cookies
import userRoutes from './routers/user.router';
import { AppDataSource } from './config/database.config';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import bodyParser from "body-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies
app.use(
  session({
    secret: 'your_session_secret', // Replace with your session secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => res.render('login'));

// Use routes
app.use(userRoutes);

// Initialize the database and start the server
AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server started on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });


