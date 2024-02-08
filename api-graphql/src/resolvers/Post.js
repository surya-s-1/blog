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