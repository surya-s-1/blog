const mysql = require('mysql')

// Establish a connection to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'blog',
    insecureAuth: true
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ',err)
        return
    }

    console.log('Connected to database')
})

module.exports = connection;