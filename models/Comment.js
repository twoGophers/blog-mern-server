import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    },
    { timestamps: true },
)
export default mongoose.model('Comment', CommentSchema)