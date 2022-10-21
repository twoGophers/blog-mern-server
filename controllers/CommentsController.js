import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const createComment = async (req, res) => {
    try {
        const { fullName, imageAvatar } = await UserModel.findById(req.userId).exec();
        const newComment = new CommentModel({
            comment: req.body.comment,
            userName: fullName,
            imageAvatarUrl: imageAvatar
        });

        if (!req.body.comment) {
            return res.json({ message: 'Комментарий не может быть пустым' })
        } 
        
        await newComment.save();

        const postId = req.params.id;

        try {
            await PostModel.findByIdAndUpdate( postId, {
                $push: { 
                    comments: newComment,
                }
            })
        } catch (error) {
            console.log(error)
        };

        res.json(newComment);
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};

export const getAllComment = async (req, res) => {
    try{
        const comment = await CommentModel.find().populate('comment').limit( 10 ).exec();
        res.json(comment);
    } catch(err) {
        console.log(err);
        res.status(404).json({
          message: 'Не удалось отобразить статьи',
        })
    }
};

