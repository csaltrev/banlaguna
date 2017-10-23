const login = require(`${__dirname}/routes/login.js`);
const admin = require(`${__dirname}/routes/admin.js`);
const user = require(`${__dirname}/routes/user.js`);

const bodyParser = require('body-parser');
const session = require('express-session');

const express = require('express');
const app = express();

app.set('trust proxy', 1);
app.set('port', (process.env.PORT || 3000));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
  secret: 'admin afedz',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change for production
}));

app.use('/', login);
app.use('/admin', admin);
app.use('/user', user);

app.listen(app.get('port'), () => {
    console.log(`Running on port ${app.get('port')}...`);
});