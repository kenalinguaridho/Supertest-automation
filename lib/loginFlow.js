const users = require('../dataset/users.js')
jwt = require('jsonwebtoken'),
require('dotenv').config()

module.exports = () => {

    const token = {}

    users.forEach((user) => {

        let userData = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            isActive: user.isActive
        }

        token[user.username] = jwt.sign(userData, process.env.SECRET_KEY)
        
    })

    return token

}