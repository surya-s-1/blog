/* As the data is sent through request bodies through forms from front-end, the data is given as arguments to GraphQL queries and mutations */

/* The posts, comments and users tables in the database are connected using user id and post id as the foreign keys. So here include{users: true} argument is used to get access to get all the details of the user of a post or a comment, instead of just the user id. */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const APP_SECRET = "MyBlog"

// Register a new user
async function register (parent, args, context, info) {

    // Find if the email is already used. If so, send an error message
    const existingEmail = await context.prisma.user.findUnique({
        where: {
            email: args.email
        }
    })

    if (existingEmail) {
        throw new Error ('Email already taken')
    }

    // Find if the username is already used. If so, send an error message
    const existingName = await context.prisma.user.findUnique({
        where: {
            name: args.name
        }
    })

    if (existingName) {
        throw new Error ('Username already taken')
    }

    // If both the email and username aren't used before, then hash the password and store the email, username and password in db
    const hashedPassword = await bcrypt.hash(args.password, 10)

    const newUser = await context.prisma.user.create({
        data: {
            name: args.name,
            email: args.email,
            password: hashedPassword
        }
    })
    
    return newUser
}

// Login an existing user
async function login (parent, args, context, info) {
    // Find if the username is present. If not, send an error message
    const existingUser = await context.prisma.user.findUnique({
        where: {
            name: args.name
        }
    })

    if (!existingUser) {
        throw new Error ('Username not found')
    }

    // Find if the password matches. If not, send an error message
    const validation = await bcrypt.compare(args.password, existingUser.password)

    if (!validation) {
        throw new Error ('Password incorrect')
    }

    // If username and password match, sign a token and include username to be used in the front-end. Set the token expiration time and return the token
    const token = jwt.sign({username: existingUser.name}, APP_SECRET, {expiresIn: '15m'})

    return {token}
}

// Post a new post
async function newPost (parent, args, context, info) {
    // Get a user using the username
    const user = await context.prisma.user.findUnique({
        where: {
            name: await args.username
        }
    })

    // Add the post using the id of the user
    const newPost = await context.prisma.post.create({
        data: {
            title: args.title,
            content: args.content,
            userId: user.id
        }
    })

    // Get the details of the user along with other details of post and return
    const newPostDetails = await context.prisma.post.findUnique({
        where: {
            id: newPost.id
        },
        include: {
            users: true
        }
    })

    return newPostDetails
}

// Post a new comment under a post
async function newComment (parent, args, context, info) {
    // Get a user using the username
    const user = await context.prisma.user.findUnique({
        where: {
            name: await args.username
        }
    })

    // Add the comment using the id of the user and post id from the arg
    const newComment = await context.prisma.comment.create({
        data: {
            content: args.comment,
            userId: user.id,
            postId: Number(args.post_id)
        }
    })

    // Get the details of the user along with other details of comment and return
    const newCommentDetails = await context.prisma.comment.findUnique({
        where: {
            id: newComment.id
        },
        include: {
            users: true
        }
    })

    return newCommentDetails
}

module.exports = {
    register, login, newPost, newComment
}