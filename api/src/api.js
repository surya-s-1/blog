const express = require('express')
const app = express()
const PORT = 9000

// Import routes
const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const loginRoutes = require('./routes/login')

// Allow CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

app.use(loginRoutes)
app.use(getRoutes)
app.use(postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

module.exports = app