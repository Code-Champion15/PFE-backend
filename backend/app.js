require('dotenv').config(); 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); 

const http = require('http');
const { connectDB } = require('./Db/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoute');
var pagesRouter = require('./routes/pageRoute')
var app = express();

connectDB();

app.use(logger('dev'));
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pages', pagesRouter);

// Middleware 
app.use((req, res, next) => {
    next(createError(404, 'Route introuvable'));
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur interne du serveur',
    });
});

// Création et lancement du serveur
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
