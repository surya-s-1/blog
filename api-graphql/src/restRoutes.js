async function register(req, res, apolloServer) {
    const {username, email, password} = req.body

    const response = await apolloServer.executeOperation({
        query: `
            mutation {
                register(name: "${username}", email: "${email}", password: "${password}") {
                    id
                }
            }
        `
    })

    if (response.data) {
        res.json({message: 'Registration successful'})
    } else {
        res.json({message: response.errors[0].message})
    }
}

async function login(req, res, apolloServer) {
    const {username, password} = req.body

    const response = await apolloServer.executeOperation({
        query: `
            mutation {
                login(name: "${username}", password: "${password}") {
                    token
                }
            }
        `
    })

    if (response.data) {
        const token = response.data.login.token
        res.json({token})
    } else {
        res.json({message: 'Invalid credentials'})
    }
}

async function posts (req, res, apolloServer) {
    const {data} = await apolloServer.executeOperation({
        query: `
        query {
            posts {
              id
              title
              content
              createdAt
              users {
                name
              }
            }
          }
        `
    })

    const posts = data.posts
    const postsData = posts.map(post=>{
        const {id, title, content, createdAt, users } = post

        const newStructure = {
            post_id: Number(id),
            title,
            content,
            post_time: createdAt,
            username: users.name
        }

        return newStructure
    })

    res.json(postsData)
}

function setupRestRoutes(app, apolloServer) {
    app.get('/graphql/blog/posts', (req,res)=> posts(req,res,apolloServer))
    app.post('/graphql/blog/login', (req,res)=> login(req,res,apolloServer))
    app.post('/graphql/blog/register', (req,res)=> register(req,res,apolloServer))
}

module.exports = {setupRestRoutes}