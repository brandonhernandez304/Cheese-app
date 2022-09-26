// D E P E N D E N C I E S //
//get .env var
require("dotenv").config();
//pull PORT from .env, give default value of 4000
const { PORT = 4000 } = process.env;
//import express
const express = require("express");
//create app object
const app = express();
// import mongoose 
const mongoose = require("mongoose");
//define MONGODB
const MONGODB_URL=process.env.MONGODB_URL
//import the middleware
const cors = require("cors");
const morgan = require("morgan")

// D A T A B A S E     C O N N E C T I O N //
//Establishing Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
// Connection Events
mongoose.connection
    .on("open", ()=> console.log("Connected to mongoose"))
    .on("close",() => console.log("Mongoose disconnected"))
    .on("error", (error)=> console.log(error));

// M O D E L S //
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})
const Cheese = mongoose.model("Cheese", CheeseSchema)

// M I D D L E W A R E //
app.use(cors());//prevents cors errors, open access to all origins
app.use(morgan("dev"))//for logging
app.use(express.json())//parse json w express
//test route
app.get('/', (req,res)=>{
    res.send('Hello Cheese World!')
})
// R O U T E S //

// I N D U C E S //
// Cheese Index
app.get('/cheese', async(req,res)=>{
    try {
        //send all cheeses
        res.json(await Cheese.find({}))
    } catch (error){
        //send an error
        res.status(400).json(error)
    }
})
// Cheese New
// Cheese Delete
app.delete("/cheese/:id", async (req,res) =>{
    try {
        //send all and delete by id
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error){
        res.status(400).json(error)
    }
})
// Cheese Update
app.post("/cheese/:id", async (req,res)=>{
    try {
        //send all cheese anyway, then find by id
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})
// Cheese Edit
// Cheese Create
app.post("/cheese", async (req,res)=>{
    try{
        //send all cheeses
        res.json(await Cheese.create(req.body))
    } catch (error){
        res.status(400).json(error)
    }
})
// Cheese Edit
// Cheese Show
// L I S T E N //
app.listen(PORT, () => console.log(`listening on cheese PORT ${PORT}`))