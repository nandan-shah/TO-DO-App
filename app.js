const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
var workList=[];
var items=["learn Node","learn express","make To-Do app"];

app.get("/", (req, res) => {
    
    var options = { 
    weekday: "long", 
    year: "numeric", 
    month: "short", 
    day: "numeric" }; 
var todays = new Date();
var today = todays.toLocaleDateString('en-US',options);
res.render("list", { listTitle : today, newItem:items});
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle :"Work", newItem:workList});
})
app.post("/", (req, res) => {
    var Item=req.body.next_item;
    if(req.body.listType==="Work"){
        workList.push(Item);
        res.redirect('/work');
    }
    else{
        items.push(Item);
        res.redirect('/');
    }   
})

app.listen(3000, () => {
console.log("runing on port 3000");
});
