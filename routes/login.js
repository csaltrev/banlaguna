const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.accounts;');
        res.render('login', {users: rows});
    } catch(e) {
        res.send(e);
    }
});

router.post('/', async (req, res, next) => {});
