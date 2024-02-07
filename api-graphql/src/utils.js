const jwt = require('jsonwebtoken')
const APP_SECRET = "MyBlog"

async function getUsername(req) {
    const {username} = jwt.verify(req.headers.authorization, APP_SECRET)
    console.log(username)
    return username
}

module.exports = {getUsername}