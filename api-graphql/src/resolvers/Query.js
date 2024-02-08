async function users (parent, args, context) {
    return context.prisma.user.findMany()
}

async function posts (parent, args, context) {
    return context.prisma.post.findMany({
        include: {
            users: true
        },
        orderBy: args.orderBy
    })
}

async function myPosts (parent, args, context) {
    const user = await context.prisma.user.findUnique({
        where: {
            name: await args.username
        }
    })

    const myPosts = await context.prisma.post.findMany({
        where: {
            userId: user.id
        },
        include: {
            users: true
        },
        orderBy: args.orderBy
    })

    return myPosts
}

async function postDetails (parent, args, context) {
    const post = await context.prisma.post.findUnique({
        where: {
            id: args.id
        },
        include: {
            users: true
        }
    })

    return post
}

module.exports = {
    users, posts, postDetails, myPosts
}