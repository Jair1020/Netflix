const express = require('express');
const app= express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require("morgan");
dotenv.config();

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then (()=>console.log ("DB connection successful")).catch(err=>console.log(err));

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", require('./routes/auth'));  
app.use ("/api/users", require("./routes/users"));
app.use ("/api/movies", require("./routes/movies"));
app.use ("/api/lists", require("./routes/lists"));


app.listen (8800, () => {
    console.log('Server is running on port 8800');
});