const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/public`));

app.set('port', (process.env.PORT || 3000));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', async (req, res, next) => {
    try {
        res.render('login');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.get('/user', async (req, res, next) => {
    try {
        res.render('user');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.get('/admin', async (req, res, next) => {
    try {
        res.render('admin');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.listen(app.get('port'), () => {
    console.log(`Running on port ${app.get('port')}...`);
});