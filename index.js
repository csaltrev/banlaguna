const db = require(`${__dirname}/db/index.js`);
const login = require(`${__dirname}/routes/login.js`);
const admin = require(`${__dirname}/routes/admin.js`);
const user = require(`${__dirname}/routes/user.js`);

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 3000));
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', login);
app.use('/admin', admin);
app.use('/user', user);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(res.status);
});

app.get('/user', async(req, res, next) => {
    try {
        res.render('user');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.listen(app.get('port'), () => {
    console.log(`Running on port ${app.get('port')}...`);
});