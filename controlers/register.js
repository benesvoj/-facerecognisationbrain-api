const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    console.log(email, name, password);

    const hash = bcrypt.hashSync(password, saltRounds);

    db
        .transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0]);
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register: ' + err))
    console.log(loginEmail[0].email);
}

module.exports = {
    handleRegister: handleRegister
}