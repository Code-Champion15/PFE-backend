require("dotenv").config(); 
const {sequelize} = require("./Db/db");

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
//var pagesRouter = require('./routes/pageRoute');
var modificationRouter = require('./routes/modificationRoute');
var adminRoutes = require("./routes/adminRoutes");
var authRouter = require('./routes/authRoute');
var statisticsRoutes = require("./routes/statisticsRoutes");
var aiRouter = require('./routes/aiRoute');
var fileRoutes = require("./routes/fileRoutes");
var operationRoutes = require('./routes/operationRoutes');
var visitRouter = require('./routes/visitRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
var projetRoutes = require('./routes/ProjetRoutes');
const deployRoute = require("./routes/deploy");
const avisRoutes = require("./routes/avisRoutes");
const statsRoutes = require('./routes/statsRoutes');
const bodyParser = require('body-parser');
var app = express();

connectDB();

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée !");
  })
  .catch((error) => {
    console.error("Erreur de synchronisation de la base de données :", error);
  })
app.use(logger('dev'));
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/pages', pagesRouter);
app.use('/auth', authRouter)
app.use('/statistics', statisticsRoutes);
app.use('/ai', aiRouter);
app.use('/modification', modificationRouter);
app.use('/profils',adminRoutes);

app.use('/api/files', fileRoutes);
app.use('/operations', operationRoutes);
app.use('/visites',visitRouter);
app.use('/api', uploadRoutes);
app.use('/api/projets', projetRoutes);
app.use('/deploy', deployRoute);
app.use("/api/avis", avisRoutes);
app.use('/api/stats', statsRoutes);
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

app.use(bodyParser.json());

// Création et lancement du serveur
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
