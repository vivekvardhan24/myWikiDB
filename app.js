const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { mongo } = require("mongoose");
const { ObjectId } = require("bson");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("article", articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.route("/articles")

  .get(function(req, res){
    Article.find({},function(err, foundArticles){
      if(err){
        console.log(err);
      }
      else{
        res.send(foundArticles);
      }
    })
  })

  .post(function(req,res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("new Article is inserted into DB");
      }
    })
  })

  .delete(function(req, res){
    Article.deleteMany(function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("Successfully deleted all records");
      }
    })
  });


app.route("/articles/:id")

  .get(function(req,res){
    Article.findOne({_id: req.params.id},function(err, foundArticles){
      if(err){
        console.log(err);
      }
      else if(foundArticles){
        res.send(foundArticles);
      }
      else{
        res.send("No article found with the id");
      }
    })
  })

  .put(function(req,res){
    Article.findByIdAndUpdate(req.params.id,{
      title: req.body.title,
      content: req.body.content
    },{overwrite: true},
    function(err){
      console.log(req.body);  
      if(err){
        res.send(err);
      }
      else{
        res.send("Successfully updated the record")
      }
    })
  })
  
  .delete(function(req,res){
    Article.findByIdAndDelete(req.params.id, function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("Successfully deleted the record")
      }
    })
  })
  
  .patch(function(req,res){
    Article.findByIdAndUpdate(req.params.id,
      {$set: req.body},function(err){
        if(err){
          res.send(err);
        }
        else{
          res.send("Successfully Patched article");
        }
      })
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});