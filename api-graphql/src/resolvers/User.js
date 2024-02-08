// A resolver function to be able to query posts field of a user
async function posts (parent, args, context) {
    return context.prisma.user.findUnique({where:{id: parent.id}}).posts()
}

module.exports = {posts}