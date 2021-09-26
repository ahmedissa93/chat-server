const User = require('../models/User');
const jwt = require('jsonwebtoken');
const maxAge = 5 * 24 * 60 * 60
const createJWT = id => {
    return jwt.sign({ id }, 'chatroom secret', {
        expiresIn: maxAge
    })
}
const alertError = (err) => {
    let errors = { name: '', email: '', password: '' }
    console.log('err message', err.message);
    console.log('err code', err.code);
    if (err.message === 'incorrect email') {
        errors.email = 'This email not found';
    }
    if (err.message === 'incorrect pwd') {
        errors.password = 'The password is incorrect';
    }
    if (err.code === 11000) {
        errors.email = 'This email already registered';
        return errors;
    }
    if (err.message.includes('user validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}
module.exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = createJWT(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user });
    } catch (error) {
        let errors = alertError(error);
        res.status(400).json({ errors });
    }

}
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("here from device")
        const user = await User.login(email, password);
        console.log(user)
        const token = createJWT(user._id);
        res.cookie('jwt', token, {domain: 'http://localhost:8080', httpOnly: true, maxAge: maxAge * 1000 })
        console.log(req.cookies.jwt);
        delete user['password'];
        res.status(201).json({ user });
    } catch (error) {
        console.log(error)
        let errors = alertError(error);
        res.status(400).json({ errors });
    }
}
module.exports.verifyuser = async (req, res, next) => {
    const cookies = req;
    const token = req.cookies.jwt;
    // console.log(token)
    console.log(cookies)
    // console.log("ahmed")
    if (token) {
        jwt.verify(token, 'chatroom secret', async (err, decodedToken) => {
            console.log("ahhahaha")
            console.log('decoded token', decodedToken)
            if (err) {
                console.log(err.message)
            } else {
                let user = await User.findById(decodedToken.id)
                res.json(user);
                next();

            }
        })
    } else {
        // console.log("undefined")
        // res.json("undefined");
        next();
    }
}
module.exports.logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 })
    res.status(200).json({ logout: true })
}
