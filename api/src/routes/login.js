const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const connection = require('../mysql')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const secretKey = 'mySecretKey'
router.use(cors())
router.use(bodyParser.json())

/* REGISTER a new user */

router.post('/api/blog/register', async (req, res) => {
    const { username, password, email } = req.body

    try {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, response) => {
            if (err) {
                console.error(err)
                return
            }
    
            const result = JSON.parse(JSON.stringify(response))
            const existingUser = result[0]

            // Check if username is available
            if (existingUser) {
                res.status(400).json({message: 'Username already taken'})
                return
            }

            connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err, response) => {
                if (err) {
                    console.error(err)
                    return
                }

                res.json({message: 'Registration successful'})
            })
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

/* LOGIN an existing user */

router.post('/api/blog/login', async (req, res) => {
    const {username, password} = req.body

    try {
        // Check if username is available
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, response) => {
            if (err) {
                console.error(err)
                return
            }
    
            const result = JSON.parse(JSON.stringify(response))
            const existingUser = result[0]

            // Sends an error message to be displayed on front end if username is not present
            if (!existingUser) {
                return res.status(400).json({message: 'Invalid credentials'})
            }

            const passwordCheck = (password === existingUser.password)

            // If password check is successful i.e., true, then a jwt token is created along with username and sent as a response 
            if (passwordCheck) {
                const token = jwt.sign({username}, secretKey, {expiresIn: '15m'})
                res.json({token})
            } else {
                // If username is present but password doesn't match
                res.status(401).json({message: 'Invalid credentials'})
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
    }
})

module.exports = router;