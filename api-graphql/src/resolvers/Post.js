// A resolver function to be able to query comments field of a post
async function comments (parent, args, context) {
    return context.prisma.post.findUnique({
        where: {
            id: parent.id
        }
    }).comments({
        include: {
            users: true
        }
    })
}

module.exports = {comments}