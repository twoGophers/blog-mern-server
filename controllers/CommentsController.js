import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const createComment = async (req, res) => {
    try {
        const newComment = new CommentModel({
            comment: req.body.comment,
        })

        // if (!comment) {
        //     return res.json({ message: 'Комментарий не может быть пустым' })
        // } 
        
        await newComment.save();

        const postId = req.params.id;

        try {
            await PostModel.findByIdAndUpdate( postId, {
                $push: { comments: newComment },
            })
        } catch (error) {
            console.log(error)
        };

        res.json(newComment)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};