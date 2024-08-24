const express = require('express')
const router = express.Router()
const connection = require('../mysql')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

/* UPDATE a post */

router.put('/api/blog/posts/:id', async (req,res) => {
    var post_id = req.params.id
    const { title, content, username } = req.body

    if (title === '' || content === '') {
        res.status(403).json({message:`Please fill both title and content`})
        return
    }

    if (username === undefined) {
        res.status(400).json({message:`Username error`})
        return
    }

    connection.query(`UPDATE posts
        SET title = ?, content = ?
        WHERE post_id = ?`,[title, content, post_id], (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response[0])})
})

module.exports = router