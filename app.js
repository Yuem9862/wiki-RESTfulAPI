const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// TODO - set up MongoDB:
//connect to database
mongoose.connect("mongodb://localhost:27017/wikiDB");
// create mongo schema
const articleSchema = mongoose.Schema({
  title: String,
  content: String
});
// create mongo model
const Article = mongoose.model("Article", articleSchema);



///////////////////////////////request targeting all articles/////////////////////////////
//fetch ALL the articles using the GET method
//create one new article
//delete all articles
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    //use the found results docs (or all articles under the rounter)
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})//no ; because this is a chained function

.post(function(req, res){
//create a new entry and save to the database; use a call back function along the save method to record the error
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added a new article");
    }else{
      res.send(err);
    }
  });
})//no ; because this is a chained function

.delete(function(req, res){
  //use deletemany to delete the entries in the database
  Article.deleteMany(
    // {},delete conditions; if removed, delete all
    function(err){
      if(!err){
        res.send("successfully deleted all");
      }else{
        res.send(err);
      }
    });
});//there is a ; because this is the end of a chained function




///////////////////////////////request targeting one article/////////////////////////////
//get a certain article
app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("no articles matching");
    }
  });
})
.put(function(req,res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
     function(err){
      if(!err){
        res.send("successfully updated");
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
    if(!err){
      res.send("successfully updated element");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted");
      }else{
        res.send(err);
      }
  });
});


app.listen(3000, function(){
  console.log("app is running on port 3000");
});
