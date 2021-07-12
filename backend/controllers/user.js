const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const readWrite = require('./readWrite');
const dataPath = './backend/db/users.json';

exports.userLogin = (req, res, next) => {

    readWrite.readFile(dataPath, true, data => {
        let fetchedUser = data[req.body.email];

        
        bcrypt.compare(req.body.password, fetchedUser.password)
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Invalid authentication credentials!'
                });
            }

            const token = jwt.sign(
                {email: fetchedUser.email, userId: fetchedUser.id},
                process.env.JWT_KEY,
                { expiresIn: '1h'}
            );
          
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser.id
            });
        })
        .catch(err => {
            return res.status(401).json({
              message: 'Invalid authentication credentials!'
            });
        });        
    });
}
