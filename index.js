  import express  from "express";
  import fs from 'fs';
  import mongoose from 'mongoose';
  import { loginValidation, postCreateValidation, registerValidation } from './validations/validations.js';
  import multer from 'multer';
  import { UserController, PostController, CommentsController } from './controllers/index.js';
  import { checkAuth, handleValidationErrors } from './utils/index.js';
  import cors from 'cors';
  import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
  dotenv.config();

  mongoose
    .connect(
        process.env.MONGODB_URL 
      || process.env.MONGODB_URI
      || `mongodb+srv://${process.env.MONGOBD_ADMIN}:${process.env.MONGOBD_PASSWORD}@blog-mern.uujfxbe.mongodb.net/?retryWrites=true&w=majority`
      // 'mongodb+srv://admin:blog-mern@blog-mern.uujfxbe.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err))

  const app = express();

  app.use(express.json());
  app.use(express.static('avatar'));
  app.use(cors());
  //Хранилище для картинок - мультер
  const storage = multer.diskStorage({
    //Описание пути для хранения картинок
    destination: (_, file, cb) => {
      if(_.originalUrl === '/upload') {
        if(!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');    
      } else {
        if(!fs.existsSync('avatar')) {
          fs.mkdirSync('avatar');
        }
        cb(null, 'avatar');
      }
    },

    //Названеие файла
    filename: (_, file, cb) => {
      cb(null, file.originalname) ;
    },
  });

  const upload = multer({ storage }) ;
  app.use('/uploads', express.static('uploads'));
  app.use('/avatar', express.static('avatar'));

  //Avtor
  app.post('/auth/login', loginValidation, handleValidationErrors,  UserController.login );
  //Register
  app.post('/auth/register',  registerValidation, handleValidationErrors, UserController.register );
  //User me
  app.get('/auth/me', checkAuth, UserController.getMe);

  //Роут для хранения файлов
  app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,

    });
  });

  app.post('/avatar', upload.single('image'), (req, res) => {
    res.json({
      url: `/avatar/${req.file.originalname}`,
    });
  });

  //New post
  app.get('/posts', PostController.getAll);
  app.get('/posts/popular', PostController.getAllPopular);
  app.get('/tags', PostController.getLastTags);
  app.get('/tags/:id', PostController.getTagsFilter);
  app.get('/posts/tags', PostController.getLastTags);
  app.get('/posts/:id', PostController.getOne);
  app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
  app.delete('/posts/:id', checkAuth, PostController.remove);
  app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

  //Comments
  app.post('/posts/:id/comments', checkAuth, CommentsController.createComment);
  app.get('/posts/:id/comments', PostController.getComment);
  app.get('/comments', CommentsController.getAllComment);

  app.listen( process.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
  });