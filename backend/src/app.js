const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes');
const {geminiResponse} = require('../gemini');


const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());





app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

module.exports = app;
