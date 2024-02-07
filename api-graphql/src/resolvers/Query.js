async function users (parent, args, context) {
    return context.prisma.user.findMany()
}

async function posts (parent, args, context) {
    return context.prisma.post.findMany({
        include: {
            users: true
        }
    })
}

async function postdetails (parent, args, context) {
    const post = await context.prisma.post.findUnique({
        where: {
            id: args.id
        }
    })

    return post
}

module.exports = {
    users, posts, postdetails
}