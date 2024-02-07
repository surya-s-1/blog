async function comments (parent, args, context) {
    return context.prisma.post.findUnique({where:{id: parent.id}}).comments()
}

module.exports = {comments}