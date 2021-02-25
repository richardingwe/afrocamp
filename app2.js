const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/DesignPlusDataase");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));


const nameSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {

});

app.listen(3000, () => {
    console.log("server has started!")
});