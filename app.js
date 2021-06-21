const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//mongoDb 
mongoose.connect("mongodb://localhost:27017/todoDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item',itemSchema);

const item1= new Item ({
    name: "Welcome to your todolist"
});

const item2= new Item ({
    name: "Hit the + button to inset new item "
});
const item3= new Item ({
    name: "<-- Hit this to delete an item"
});
const defaultItem=[item1,item2,item3];

const listSchema= {
    name: String,
    items:[ itemSchema ]
};

const List = mongoose.model("List",listSchema);

app.get("/", (req, res) => {
    var options = { 
    weekday: "long", 
    year: "numeric", 
    month: "short", 
    day: "numeric" }; 
var todays = new Date();
var today = todays.toLocaleDateString('en-US',options);

Item.find({},function (err,result) {
   if(err){
       console.log(err);
   } 
   else{
       if(result.length===0){

Item .insertMany(defaultItem, function (err) {
    if(err){
        console.log(err);
    }
    else{
        console.log("succesfullyadded default item")
    }
});
    res.redirect('/');
       }
       else{
       res.render("list", { listTitle : today, newItem:result});
       }
   }
});

});

app.get("/:listName",function(req,res){
const customListName= req.params.listName;
List.findOne({name:customListName},function(err,foundList){
    if(!err){
        if(!foundList){
            const list =new List({
            name:customListName,
            items:defaultItem
            });
            list.save();
            res.redirect("/customListName");
            }
            else{
                res.render("list", { listTitle : foundList.name, newItem:foundList.items});
            }
         }   
});

});



app.post("/", (req, res) => {
    var itemToAdd=req.body.next_item;
    const item_add= new Item ({
    name: itemToAdd
});
item_add.save();
 res.redirect('/');
});

app.post("/delete", (req, res) => {
const checkedItem= req.body.checkbox;
Item.deleteOne({_id:checkedItem}, function (err) {
   if(err){
       console.log(err);
   } 
   else{
       console.log("success");
       res.redirect('/');
   }
});
});

app.listen(3000, () => {
console.log("runing on port 3000");
});
