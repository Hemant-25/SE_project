const Users = require('../models/Users');
const bcrypt = require('bcrypt-nodejs');

exports.login = async (login) => {
    const user = await Users.findOne({ email: login.email });
    if (!user) {
        throw new Error({ message: 'user not present', status: 204 });
    }
    bcrypt.compare(login.password, user.password, (err, isMatch) => {
        if (!isMatch) {
            // eslint-disable-next-line max-len
            throw new Error({ message: 'email or password invalid', status: 401 });
        }
    });
    return user;
};

exports.signup = async (userData) => {
    const userPresent = await Users.findOne({ email: userData.email });
    if (userPresent === null) {
        const users = new Users(userData);
        users.save((err, result) => {
            console.log(err);
            if (err) {
                throw new Error({ message: 'user is not saved', status: 500 });
            }
        });
        return { message: 'user saved sucesfully' };
    } else {
        // eslint-disable-next-line max-len
        throw new Error({ message: `${userData.email} already exists`, status: 401 });
    }
};

exports.upload = (req, res) => {
    if (req.files.length <= 0) {
        res.status(404).send({ message: 'no file recieved' });
    } else {
        res.status(200).send({ message: 'file successfully recieved' });
    }
};