const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', async (req, res, next) => {
    try {
        const content = {
        };
        res.render('login');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.get('/user', async (req, res, next) => {
    try {
        const content = {
        };
        res.render('user');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.get('/admin', async (req, res, next) => {
    try {
        const content = {
        };
        res.render('admin');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});