const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/', async(req, res, next) => {
    const sess = req.session;
    if (sess.username === 'admin') {
        res.redirect('/admin');
    } else if (sess.username && sess.userId) {
        res.redirect(`/user/${sess.userId}`);
    } else {
        const query = 'SELECT * FROM public.accounts;';
        const {
            rows
        } = await db.query(query);
        res.render('login', {
            users: rows
        });
    }
});

router.post('/', async(req, res, next) => {
    try {
        const password = req.body.password;
        const query = 'SELECT * FROM public.accounts WHERE password = $1;';
        const {
            rows
        } = await db.query(query, [password]);

        req.session.username = rows[0].username;
        req.session.userId = rows[0].id;

        const path = rows[0].username === 'admin' ? '/admin' : `/user/${rows[0].id}`;
        res.redirect(path);
    } catch (e) {
        res.redirect('back');
    }
});
