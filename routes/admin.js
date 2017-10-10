const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/', async(req, res, next) => {
    try {
        await db.query("INSERT INTO public.accounts (username, password) VALUES('carlos', 'root');");
        const {
            rows
        } = await db.query('SELECT * FROM public.accounts;');
        console.log(rows[0]);
        res.render('admin', rows[0]);
    } catch (e) {
        console.log(e);
        next(e);
    }
});