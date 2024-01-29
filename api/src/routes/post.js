const express = require('express')
const router = express.Router()
const connection = require('../mysql')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

/* POST a new post*/

router.post('/api/blog/posts', (req,res) => {
    const { title, content, username } = req.body
    console.log(req.body)

    if (title === '' || content === '') {
        res.status(403).json({message:`Please fill both title and content`})
        return
    }

    if (username === undefined) {
        res.status(400).json({message:`Username error`})
        return
    }

    connection.query('INSERT INTO posts (title, content, username) VALUES (?, ?, ?)', [title, content, username], (err, response) => {
        if (err) {
            console.error('Error creating post: ', err)
            res.status(500).send('Error creating post')
            return
        }

        console.log('Post created successfully')
        res.status(201).json({success: true, post_id: response.insertId})
    })
})

/* POST a new comment*/

router.post('/api/blog/comments', (req,res) => {
    const { post_id, username, comment } = req.body

    if (comment === undefined) {
        res.status(403).json({message: `Please fill a comment to send`})
        return
    }

    if (username === undefined || post_id === undefined) {
        res.status(400).json({message: `Error`})
        return
    }

    connection.query('INSERT INTO comments (post_id, username, comment) VALUES (?, ?, ?)', [post_id, username, comment], (err, response) => {
        if (err) {
            console.error('Error creating comment: ', err)
            res.status(500).send('Error creating comment')
            return
        }

        console.log('Comment created successfully')
        res.status(201).json({message: 'Commented'})
    })
})

module.exports = router;