const express = require("express");

const Posts = require("../helpers/postDb.js");
const Users = require("../helpers/userDb.js");

const router = express.Router();

const getposts = (req, res) => {
  Posts.get()
    .then(postobjects => {
      res.status(200).json(postobjects);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to validate user ID" });
    });
};

router.post("/", (req, res) => {
  const { text, user_id } = req.body;
  const addition = { text, user_id };
  if (!text || !user_id) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide both text and user ID" });
  }
  Users.getById(user_id).then(user => {
    if (user) {
      Posts.insert(addition).then(() => getposts(req, res))
    }
    else {
      res.status(404).json({ message: "No User Found with Matching user ID"})
    }
  })
    .catch(() =>
      res
        .status(500)
        .json({
          success: false,
          message: "There was an error while saving the user to the database."
        })
    );
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
