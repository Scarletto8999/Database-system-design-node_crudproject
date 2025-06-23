// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
// Access the PORT variable from process.env
const PORT = process.env.PORT || 4000;

//database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Event listeners for the connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// midle wares

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req,res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});



app.set('view engine','ejs');

//route prefix
app.use("",require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
