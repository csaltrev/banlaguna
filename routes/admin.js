const dateTime = require(`${__dirname}/../util/dateTime.js`);
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
            admin.balance = parseFloat(admin.balance).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

            const usersQuery = 'SELECT * FROM public.accounts;';
            const usersRes = await db.query(usersQuery);
            const users = usersRes.rows;

            const formattedUsers = users;
            formattedUsers.forEach(user => {
                user.balance = parseFloat(user.balance).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
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
        const transactionsQuery = 'SELECT * FROM public.transactions WHERE sender = $1 OR receiver = $2;';
        const transactionsRes = await db.query(transactionsQuery, [userId, userId]);
        const userTransactions = transactionsRes.rows;

        const usersQuery = 'SELECT * FROM public.accounts;';
        const usersRes = await db.query(usersQuery);
        const users = usersRes.rows;

        userTransactions.forEach(transaction => {
            transaction.receiver = users.find(u => u.id.toString() === transaction.receiver.toString()).username;
            transaction.timestamp = dateTime.format(transaction.timestamp);
            transaction.quantity = parseFloat(transaction.quantity).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            if (transaction.sender.toString() === userId.toString()) {
                transaction.quantity = `-${transaction.quantity}`;
            }
            transaction.sender = users.find(u => u.id === transaction.sender).username;
        });

        res.send(userTransactions);
    } catch (e) {
        res.send(e.stack);
    }
});

router.post('/account', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const addUserQuery = 'INSERT INTO public.accounts (username, password, balance) VALUES ($1, $2, $3);';
        await db.query(addUserQuery, [username, password, 0]);

        res.redirect('/');
    } catch (e) {
        res.send(e.stack);
    }
});

router.post('/reset', async (req, res, next) => {
    const password = req.body.password;
    try {
        if (password === 'garrapatas.egipcias') {
            const deleteAccountsQuery = 'TRUNCATE public.accounts;';
            await db.query(deleteAccountsQuery);
    
            const deleteTransactionsQuery = 'TRUNCATE public.transactions;';
            await db.query(deleteTransactionsQuery);
    
            const createAdminQuery = 'INSERT INTO public.accounts (username, password, balance) VALUES ($1, $2, $3);';
            await db.query(createAdminQuery, ['admin', 'garrapatas.egipcias', 999999999]);
    
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    } catch (e) {
        res.send(e.stack);
    }
});

router.post('/single', async (req, res, next) => {
    const quantity = req.body.quantity;
    const concept = req.body.concept;

    if (isValid(quantity, concept)) {
        try {
            const senderId = req.body.sender;
            const receiverId = req.body.receiver;

            const senderQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
            const senderRes = await db.query(senderQuery, [senderId]);
            const sender = senderRes.rows[0];
    
            const receiverQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
            const receiverRes = await db.query(receiverQuery, [receiverId]);
            const receiver = receiverRes.rows[0];
    
            if (sender.username !== 'admin') {
                const newSenderBalance = parseFloat(sender.balance) - parseFloat(quantity);
                const senderBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
                await db.query(senderBalanceQuery, [newSenderBalance, senderId]);
            }
            
            const newReceiverBalance = parseFloat(receiver.balance) + parseFloat(quantity);
            const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
            await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
        
            const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
            await db.query(transactionsQuery, [senderId, receiverId, quantity, concept]);
    
            res.redirect('/');   
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/');
    }
});

router.post('/bulk', async (req, res, next) => {
    const quantity = req.body.quantity;
    const concept = req.body.concept;

    if (isValid(quantity, concept)) {
        try {
            const unit = req.body.unit;
            const receiverIds = req.body.receivers;

            if (unit === 'remacoins') {
                receiverIds.forEach(async (receiverId) => {
                    const senderQuery = 'SELECT * FROM public.accounts WHERE username = $1;';
                    const senderRes = await db.query(senderQuery, ['admin']);
                    const sender = senderRes.rows[0];
            
                    const receiverQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
                    const receiverRes = await db.query(receiverQuery, [receiverId]);
                    const receiver = receiverRes.rows[0];
            
                    const newReceiverBalance = parseFloat(receiver.balance) + parseFloat(quantity);
                    const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
                    await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
                
                    const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
                    await db.query(transactionsQuery, [sender.id, receiverId, quantity, concept]);
                });
            } else if (unit === 'percent') {
                receiverIds.forEach(async (receiverId) => {
                    const senderQuery = 'SELECT * FROM public.accounts WHERE username = $1;';
                    const senderRes = await db.query(senderQuery, ['admin']);
                    const sender = senderRes.rows[0];
            
                    const receiverQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
                    const receiverRes = await db.query(receiverQuery, [receiverId]);
                    const receiver = receiverRes.rows[0];
            
                    const percentage = parseFloat(quantity / 100);
                    const newReceiverBalance = parseFloat(receiver.balance) + (parseFloat(receiver.balance) * percentage);
                    const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
                    await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
                
                    const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
                    await db.query(transactionsQuery, [sender.id, receiverId, quantity, concept]);
                });
            }
    
            res.redirect('/');   
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/');
    }
});

const isValid = (quantity, concept) => {
    let isConceptValid = false;
    let isQuantityValid = false;

    if (concept.length >= 8 &&
        concept.length <= 25) isConceptValid = true;

    if (/^\$?\d+(\d{3})*(\.\d*)?$/.test(quantity) &&
        parseFloat(quantity) >= 1 &&
        parseFloat(quantity) <= 9999999)
        isQuantityValid = true;

    return isQuantityValid && isConceptValid;
};