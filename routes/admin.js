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

        const usersQuery = 'SELECT * FROM public.accounts;';
        const usersRes = await db.query(usersQuery);
        const users = usersRes.rows;

        userTransactions.forEach(transaction => {
            transaction.receiver = users.find(user => user.id.toString() === transaction.receiver.toString()).username;
        });

        res.send(userTransactions);
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
    
            const newSenderBalance = parseFloat(sender.balance) - parseFloat(quantity);
            const newReceiverBalance = parseFloat(receiver.balance) + parseFloat(quantity);
    
            const senderBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
            await db.query(senderBalanceQuery, [newSenderBalance, senderId]);
    
            const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
            await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
        
            const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
            await db.query(transactionsQuery, [senderId, receiverId, quantity, concept]);
    
            res.redirect('/admin');   
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/admin');
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
            
                    const newSenderBalance = parseFloat(sender.balance) - parseFloat(quantity);
                    const newReceiverBalance = parseFloat(receiver.balance) + parseFloat(quantity);
            
                    const senderBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
                    await db.query(senderBalanceQuery, [newSenderBalance, sender.id]);
            
                    const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
                    await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
                
                    const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
                    await db.query(transactionsQuery, [sender.id, receiverId, quantity, concept]);
                });
            }
    
            res.redirect('/admin');   
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/admin');
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