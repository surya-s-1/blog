/* As the data is sent through request bodies through forms from front-end, the data is given as arguments to GraphQL queries and mutations */

// Register a new user
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

    // If the mutation is successful, success message is sent. Otherwise, response.data will be null and error message is sent as response
    if (response.data) {
        res.json({message: 'Registration successful'})
    } else {
        res.json({message: response.errors[0].message})
    }
}

// Login an existing user
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

    // If the mutation is successful, token is sent. Otherwise, response.data will be null and error message is sent as response
    if (response.data) {
        const token = response.data.login.token
        res.json({token})
    } else {
        res.status(401).json({message: 'Invalid credentials'})
    }
}

// Getting all posts
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

    // Restructuring the data to match how its imported in the front-end
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

// Getting posts of a particular user
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

    // Restructuring the data to match how its imported in the front-end
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

// Posting a new post
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

    // If the mutation is successful, new post's id will be sent. Otherwise, data will be null and error message is sent as response
    if (data) {
        res.status(201).json({success: true, post_id: data.newPost.id})
    } else {
        res.status(401).json({message: 'Failed to post'})
    }
}

// Posting a new comment under a post
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

    // If the mutation is successful, a success message is sent. Otherwise, data will be null and error message is sent as response
    if (data) {
        res.status(201).json({message: "Commented"})
    } else {
        res.status(401).json({message: 'Failed to comment'})
    }
}

// Getting the details of a post
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

    // Restructuring the data to match how its imported in the front-end
    const postDetails = {
        post_id: data.postDetails.id,
        title: data.postDetails.title,
        content: data.postDetails.content,
        post_time: data.postDetails.createdAt,
        username: data.postDetails.users.name
    }

    res.status(200).json(postDetails)
}

// Getting the comments under a post
async function postComments(req,res,apolloServer) {
    var id = req.params.post_id

    // Quering only the comments field of a post
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

    // Restructuring the data to match how its imported in the front-end
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

// Defining the get and post paths
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