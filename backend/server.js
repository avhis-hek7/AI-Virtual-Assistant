require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/db')

connectDb()
app.listen(process.env.PORT, ()=>{
    console.log("Server running at port 8000")
})
