import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        userName: { type: String, required: true },
        imageUrl: String,
        imageAvatarUrl: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    },
    { timestamps: true },
)
export default mongoose.model('Comment', CommentSchema)