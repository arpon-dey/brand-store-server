const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json())


app.get('/', (req, res)=>{
    res.send({message: "SErver is running on port 5000"})
})

app.listen(port, ()=>{
    console.log(`Server started on ${port}`)
})