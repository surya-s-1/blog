/* As the data is sent through request bodies through forms from front-end, the data is given as arguments to GraphQL queries and mutations */

/* The posts and users tables in the database are connected using user id as the foreign key. So here include{users: true} argument is used to get access to get all the details of the user of a post instead of just the user id. */

// Find all the users
async function users (parent, args, context) {
    return context.prisma.user.findMany()
}

// Find all the posts
async function posts (parent, args, context) {
    return context.prisma.post.findMany({
        include: {
            users: true
        },
        orderBy: args.orderBy
    })
}

// Find the posts by a particular user
async function myPosts (parent, args, context) {
    // Though the tables are connected using user id, the requests from front-end send the username. Hence, first find the user using username and then find the posts using the user's id

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
        // used to sort the posts
        orderBy: args.orderBy
    })

    return myPosts
}

// Find the details of a particular post
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