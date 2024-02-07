const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const APP_SECRET = "MyBlog"

async function register (parent, args, context, info) {
    const existingEmail = await context.prisma.user.findUnique({
        where: {
            email: args.email
        }
    })

    if (existingEmail) {
        throw new Error ('Email already taken')
    }

    const existingName = await context.prisma.user.findUnique({
        where: {
            name: args.name
        }
    })

    if (existingName) {
        throw new Error ('Username already taken')
    }

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

async function login (parent, args, context, info) {
    const existingUser = await context.prisma.user.findUnique({
        where: {
            name: args.name
        }
    })

    if (!existingUser) {
        throw new Error ('Username not found')
    }

    const validation = await bcrypt.compare(args.password, existingUser.password)

    if (!validation) {
        throw new Error ('Password incorrect')
    }

    const token = jwt.sign({username: existingUser.name}, APP_SECRET, {expiresIn: '15m'})

    return {token}
}

async function newPost (parent, args, context, info) {

    const user = await context.prisma.user.findUnique({
        where: {
            name: await args.username
        }
    })

    const newPost = await context.prisma.post.create({
        data: {
            title: args.title,
            content: args.content,
            userId: user.id
        }
    })

    return newPost
}

async function newComment (parent, args, context, info) {

    const user = await context.prisma.user.findUnique({
        where: {
            name: await args.username
        }
    })

    const newComment = await context.prisma.comment.create({
        data: {
            content: args.comment,
            userId: user.id,
            postId: Number(args.post_id)
        }
    })

    return newComment
}

module.exports = {
    register, login, newPost, newComment
}