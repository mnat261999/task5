const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser((id, done)=> {
        Users.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        //cấu hình lại
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true 
    },
    (req, email, password, done)=> {
        process.nextTick(function () {
            console.log(email)
            Users.findOne({email}, async (err, user) => {
                if (err)
                    return done(err);
                if (!user) {
                    return done(null, false);
                }

                await bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err

                    if(isMatch)
                    {
                        const accesstoken = createAccessToken({id: user._id})
                        return done(null,user,req.flash('accesstoken', accesstoken))
                    }
                    else{
                        return done(null,false)
                    }
                })

            });
        });
    }));
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'})
}
