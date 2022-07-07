const handleRegister = (req, res, db, bcrypt, saltRounds) => {

    const {email, password, name} = req.body;

    if(!email || !password || !name){
        return res.status(400).json('Incorrect form submission');
    }

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
                        }).then(user => {
                            res.json(user[0])
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register user.'))
}

module.exports = {
    handleRegister: handleRegister
}