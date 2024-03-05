const express = require('express');
const app = express();
require('dotenv').config();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const connectDB = require('./db/connectDB');

//routers for admin
const adminAuthRouter = require('./routes/adminAuthRoutes');
const adminRouter = require('./routes/adminRoutes');
const {checkRole} = require('./middleware/allowAccess')

//routers for users
const authRouter = require('./routes/authRoutes');
const usersRouter = require('./routes/usersRoutes');

//error handlers
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const authHeaderMiddleware = require('./middleware/aunthenticate');

app.use(express.json());
app.use(helmet())
app.use(cors({}));
app.use(express.urlencoded({ extended: false}))
app.use(xss());

// routes
app.use('/api/v1/adminAuth', adminAuthRouter);
app.use('/api/v1/admin', [authHeaderMiddleware,checkRole], adminRouter);
app.use('/api/v1/adminprofilepictures',express.static('adminprofilepictures'));
app.use('/api/v1/adminAttachments',express.static('adminAttachments'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authHeaderMiddleware, usersRouter);
app.use('/api/v1/userprofilepictures',express.static('userprofilepictures'));
app.use('/api/v1/userAttachments',express.static('userAttachments'));


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async () => {
   try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port,()=>{
        console.log(`Server listening on ${port}`);
    });
   } catch (error) {
    console.error(error)
   }
};

start();