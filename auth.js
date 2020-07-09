const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const usersService = require('./routes/users-service');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let user = { email: email, password: password };
        await usersService.add(user);
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await usersService.find({ email: email, password: password });
        if (!user[0]) {
            return done(null, false, { message: 'User or password incorrect' });
        } else {
            return done(null, user[0], { message: 'Logged in successfully' });
        }
    } catch (error) {
        return done(error, false, { message: 'Server Error' });
    }
}));

//Middleware that checks if the token is valid
passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('secret_token')
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

module.exports = passport;