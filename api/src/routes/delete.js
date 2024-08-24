const express = require('express')
const router = express.Router()
const connection = require('../mysql')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

/* DELETE a post */

router.delete('/api/blog/posts/:id', async (req,res) => {
    var post_id = req.params.id

    connection.query(`DELETE FROM posts WHERE post_id = ?`,[post_id], (err, response) => {
        if (err) {
            console.error('Error querying database:', err)
            res.status(500).send('Error querying database')
            return
        }

        res.json(response[0])})
})

module.exports = router