const bcrypt = require('bcrypt');
const User= require('../models/user');
const jwt= require('jsonwebtoken');

exports.signup= (req,res,next) => {
    const name= req.body.name;
    const email= req.body.email;
    const phone= req.body.number;
    const password= req.body.password;

    const saltRound= 10;
    bcrypt.genSalt(saltRound, function(err, salt) {
        bcrypt.hash(password,salt, function(err, hash) {

            User.create({name,email,phone,password: hash})
            .then(() => {
                res.status(201).json({success: true, message: 'User successfully created! You may login now!'});
            })
            .catch((err) => {
                res.status(403).json({success: false, message: 'User exists! Please login!'});
            });
        });
    });
}

function getAccessToken(id)
{
    return jwt.sign(id, process.env.TOKEN_SECRET);
}

exports.login= (req,res,next) => {
    const email= req.body.email;
    const password= req.body.password;

    User.findAll({where:{email}}).then(user => {
        if(user.length!=0)
        {
            bcrypt.compare(password, user[0].password, function(err, response) {
                if(response)
                {
                    const jwttoken= getAccessToken(user[0].id);
                    return res.status(200).json({token: jwttoken, success: true, message: 'Successfully Logged in!', user: user[0]});
                }
                else 
                {
                    return res.status(401).json({success: false, message: 'Wrong Password!'});
                }
            });
        }
        else 
        {
            return res.status(404).json({success: false, message: 'User does not exist! Please signup first!'});
        }
    });
}