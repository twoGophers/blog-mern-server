import Comment from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().sort({ createdAt: 'desc' }).populate('user').exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(404).json({
          message: 'Не удалось отобразить статьи',
        })
    }
};

export const getAllPopular = async (req, res) => {
  try{
      const posts = await PostModel.find().sort({ viewsCount: 'desc' }).populate('user').exec();
      res.json(posts);
  } catch(err) {
      console.log(err);
      res.status(404).json({
        message: 'Не удалось отобразить статьи',
      })
  }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;
  
      PostModel.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $inc: { viewsCount: 1 },
        },
        {
          returnDocument: 'after',
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось вернуть статью',
            });
          }
  
          if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }
  
          res.json(doc);
        },
      ).populate('user');
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
};

export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
  
      PostModel.findByIdAndDelete({
        _id: postId,
      },
      (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                message: 'Не удалось удалить статью',
                });
            }

            if (!doc) {
                return res.status(404).json({
                  message: 'Статья не найдена',
                });
            }

            res.json({
                success: true,
            })
        }
      )
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
};

export const create = async (req, res) => {
    try {
        const { imageAvatar } = await UserModel.findById(req.userId).exec();
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(',').map(item => item.trim()),
            user: req.userId,
            imageAvatarUrl: imageAvatar
        });

        const post = await doc.save();

        res.json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось создать статью',
        })
    };
};

export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.user,
            tags: req.body.tags.split(','),
        });

        res.json({
            success: true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось обновить статью',
        })
    }
};

export const getLastTags = async (req, res) => {
  try{
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map((obj) => obj.tags).flat().splice(0, 5);

    res.json(tags);
  } catch(err) {
      console.log(err);
      res.status(404).json({
        message: 'Не удалось отобразить статьи',
      })
  }
};

export const getTagsFilter = async (req, res) => {
  try{
    // const page = parseInt(req.query.page) - 1 || 0;
		// const limit = parseInt(req.query.limit) || 5;
		// const search = req.query.search || "";
		// let sort = req.query.sort || "rating";
		// let genre = req.query.genre || "All";

		// const genreOptions = [
		// 	"Action",
		// 	"Romance",
		// 	"Fantasy",
		// 	"Drama",
		// 	"Crime",
		// 	"Adventure",
		// 	"Thriller",
		// 	"Sci-fi",
		// 	"Music",
		// 	"Family",
		// ];

		// genre === "All"
		// 	? (genre = [...genreOptions])
		// 	: (genre = req.query.genre.split(","));
		// req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		// let sortBy = {};
		// if (sort[1]) {
		// 	sortBy[sort[0]] = sort[1];
		// } else {
		// 	sortBy[sort[0]] = "asc";
		// }

		// const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
		// 	.where("genre")
		// 	.in([...genre])
		// 	.sort(sortBy)
		// 	.skip(page * limit)
		// 	.limit(limit);

		// const total = await Movie.countDocuments({
		// 	genre: { $in: [...genre] },
		// 	name: { $regex: search, $options: "i" },
		// });

		// const response = {
		// 	error: false,
		// 	total,
		// 	page: page + 1,
		// 	limit,
		// 	genres: genreOptions,
		// 	movies,
		// };

		// res.status(200).json(response);

    const tagsUrl = req.params.id
    // const tags = req.body.tags

    const tags = await PostModel.find({ tags: tagsUrl });
  

  //   const total = await PostModel.countDocuments({
  //     tags: { $in: [...tags] },
  //   });

  // const response = {
  //   total,
  //   tags: tagsUrl,
  //   posts
  // };
    res.json(tags);
  } catch(err) {
      console.log(err);
      res.status(404).json({
        message: 'Не удалось отобразить статьи',
      })
  }
};

//Comment in to post
export const getComment = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment);
      })
    );

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Не удалось отобразить комментарий',
    })
  }
};