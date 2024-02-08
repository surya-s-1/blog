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
        res.status(401).json({message: 'Invalid credentials'})
    }
}

async function posts (req, res, apolloServer) {
    const {data} = await apolloServer.executeOperation({
        query: `
            query {
                posts(orderBy: {createdAt: desc}) {
                    id
                    title
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
        const {id, title, createdAt, users } = post

        const newStructure = {
            post_id: Number(id),
            title,
            post_time: createdAt,
            username: users.name
        }

        return newStructure
    })

    res.status(200).json(postsData)
}

async function myPosts(req,res,apolloServer) {
    var username = req.params.username

    const {data} = await apolloServer.executeOperation({
        query: `
            query {
                myPosts(orderBy: {createdAt: desc}, username: "${username}") {
                    id
                    title
                    users {
                        name
                    }
                }
            }
        `
    })

    const myPosts = data.myPosts
    const myPostsData = myPosts.map(post => {
        const {id, title, users} = post

        const newStructure = {
            post_id: Number(id),
            title,
            username: users.name
        }

        return newStructure
    })

    res.status(200).json(myPostsData)
}

async function newPost(req,res,apolloServer) {
    const {title, content, username} = req.body

    const {data} = await apolloServer.executeOperation({
        query: `
            mutation {
                newPost(title: "${title}", content: "${content}", username: "${username}") {
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

    res.status(201).json({success: true, post_id: data.newPost.id})
}

async function newComment(req,res,apolloServer) {
    const {comment, post_id, username} = req.body

    const {data} = await apolloServer.executeOperation({
        query: `
            mutation {
                newComment(comment: "${comment}", post_id: ${post_id}, username: "${username}") {
                    id
                    content
                    createdAt
                    users {
                        name
                    }
                }
            }
        `
    })

    res.status(201).json({message: "Commented"})
}

async function postDetails(req,res,apolloServer) {
    var id = req.params.post_id

    const {data} = await apolloServer.executeOperation({
        query: `
            query {
                postDetails(id: ${id}) {
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

    const postDetails = {
        post_id: data.postDetails.id,
        title: data.postDetails.title,
        content: data.postDetails.content,
        post_time: data.postDetails.createdAt,
        username: data.postDetails.users.name
    }

    res.status(200).json(postDetails)
}

async function postComments(req,res,apolloServer) {
    var id = req.params.post_id

    const {data} = await apolloServer.executeOperation({
        query: `
            query {
                postDetails(id: ${id}) {
                    comments {
                        id
                        content
                        createdAt
                        users {
                            name
                        }
                    }
                }
            }
        `
    })

    const postComments = data.postDetails.comments

    const postCommentsData = postComments.map(comment => {
        const {id, content, createdAt, users} = comment

        const newStructure = {
            comment_id: id,
            comment: content,
            comment_time: createdAt,
            username: users.name
        }

        return newStructure
    })

    res.status(200).json(postCommentsData)
}

function setupRestRoutes(app, apolloServer) {
    app.get('/graphql/blog/posts', (req,res)=> posts(req,res,apolloServer))
    app.get('/graphql/blog/posts/:username', (req,res)=> myPosts(req,res,apolloServer))
    app.get('/graphql/blog/posts/post/:post_id', (req,res)=> postDetails(req,res,apolloServer))
    app.get('/graphql/blog/comments/post/:post_id', (req,res)=> postComments(req,res,apolloServer))
    app.post('/graphql/blog/login', (req,res)=> login(req,res,apolloServer))
    app.post('/graphql/blog/register', (req,res)=> register(req,res,apolloServer))
    app.post('/graphql/blog/posts', (req,res)=> newPost(req,res,apolloServer))
    app.post('/graphql/blog/comments', (req,res)=> newComment(req,res,apolloServer))
}

module.exports = {setupRestRoutes}