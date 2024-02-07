const express = require('express')
const app = express()
const PORT = 9000


app.get('/graphql/blog/posts', async (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})