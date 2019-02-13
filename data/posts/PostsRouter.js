const express = require("express");

const Posts = require("../helpers/postDb.js");
const Users = require("../helpers/userDb.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, user_id } = req.body;
  const addition = { text, user_id };

  if (!text || !user_id) {
    return res.status(400).json({
      errorMessage: "Please provide text and user_id for the post."
    });
  }
  if (!Users.get().map(user => {return user.id}).includes(user_id)) {
    return res.status(404).json({ message: "No user exists for given User Id" })
  }
  try {
    const post = await Posts.insert(addition);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.get(req.query);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "The posts information could not be retrieved."
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const found = await Posts.getById(id);
    if (found) {
      res.status(200).json(found);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      error: "The post information could not be retrieved."
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Posts.remove(id);
    if (deleted) {
      res.send(204);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

router.put("/:id", async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const changes = { text };
  if (!text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the post."
    });
  }
  try {
    const update = await Posts.update(id, changes);
    if (update) {
      Posts.get().then(get => {
        res.status(200).json(get);
      });
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

module.exports = router;
