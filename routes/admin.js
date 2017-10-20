const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/', async(req, res, next) => {
    try {
        res.render('admin');
    } catch (e) {
        res.send(e);
    }
});