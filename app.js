//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "This is a blog website made with node and EJS. Some packages I used are express and mongoose. We created an API using node for this project";
const aboutContent =
  "This is the about section of this blog website";
const contactContent =
  "Get in touch with the creators of this blog";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find()
    .exec()
    .then((posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postId", (req, res) => {
  
  Post.findOne({ _id: req.params.postId })
    .exec()
    .then((post) => {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
