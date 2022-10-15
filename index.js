  import express  from "express";
  import mongoose from 'mongoose';
  import { loginValidation, postCreateValidation, registerValidation } from './validations/validations.js';
  import multer from 'multer';
  import { UserController, PostController } from './controllers/index.js';
  import { checkAuth, handleValidationErrors } from './utils/index.js';
  import cors from 'cors';

  mongoose
    .connect(
      process.env.MONGODB_URL
    )
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err))

  const app = express();

  app.use(express.json());
  app.use(cors());
  //Хранилище для картинок - мультер
  const storage = multer.diskStorage({
    //Описание пути для хранения картинок
    destination: (_, __, cb) => {
      cb(null, 'uploads');
    },

    //Названеие файла
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });
  app.use('/uploads', express.static('uploads'));

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

  //New post
  app.get('/posts', PostController.getAll);
  app.get('/tags', PostController.getLastTags);
  app.get('/posts/tags', PostController.getLastTags);
  app.get('/posts/:id', PostController.getOne);
  app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
  app.delete('/posts/:id', checkAuth, PostController.remove);
  app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

  app.listen(process.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
  });