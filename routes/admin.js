const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/', async(req, res, next) => {
    const sess = req.session;
    if (sess.userId && sess.username === 'admin') {
        try {
            const adminQuery = 'SELECT * FROM public.accounts WHERE username = $1;';
            const adminRes = await db.query(adminQuery, ['admin']);
            const admin = adminRes.rows[0];
            admin.balance = parseFloat(admin.balance).toFixed(2);

            const usersQuery = 'SELECT * FROM public.accounts;';
            const usersRes = await db.query(usersQuery);
            const users = usersRes.rows;

            const formattedUsers = users;
            formattedUsers.forEach(user => {
                user.balance = parseFloat(user.balance).toFixed(2);
            });

            const data = {
                admin: admin,
                users: formattedUsers
            }

            res.render('admin', data);
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/');
    }
});

router.get('/user/:id', async (req, res, next) => {
    const userId = req.params.id;
    try {
        const transactionsQuery = 'SELECT * FROM public.transactions WHERE sender = $1;';
        const transactionsRes = await db.query(transactionsQuery, [userId]);
        const userTransactions = transactionsRes.rows;

        res.send(userTransactions);
    } catch (e) {
        res.send(e.stack);
    }
});