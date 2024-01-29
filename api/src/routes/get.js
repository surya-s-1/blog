const express = require('express')
const router = express.Router()
const connection = require('../mysql')

/* API Testing */

router.get('/',(req,res)=>{
    try {
        const result = 'API working properly'
        res.status(200).send(result)
    } catch (err) {
        console.error('Error with API: ',err)
    }
})

/* GET all the posts with most recent first*/

router.get('/api/blog/posts', async (req,res) => {
    connection.query(`SELECT post_id, username, title, content, timestamp AS post_time
        FROM posts
        ORDER BY post_time DESC`, (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response)})
})

/* GET all the posts of a user with most recent first*/

router.get('/api/blog/posts/:username', async (req,res) => {
    var username = req.params.username

    connection.query(`SELECT post_id, username, title, content, timestamp AS post_time
        FROM posts
        WHERE username = ?
        ORDER BY post_time DESC`, [username], (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response)
    })
})

/* GET a post with its id */

router.get('/api/blog/posts/post/:post_id', async (req,res) => {
    var post_id = req.params.post_id

    connection.query(`SELECT post_id, title, username, content, timestamp AS post_time
        FROM posts
        WHERE post_id = ?`,[post_id], (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response[0])})
})

// GET comments of a particular post with its id

router.get('/api/blog/comments/post/:post_id', async (req,res) => {
    var post_id = req.params.post_id

    connection.query(`SELECT c.comment_id, c.username AS username, c.comment, c.timestamp AS comment_time
        FROM posts p LEFT JOIN comments c
        ON p.post_id = c.post_id
        WHERE p.post_id = ?
        ORDER BY c.comment_id;`, [post_id], (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response)})
})

module.exports = router;