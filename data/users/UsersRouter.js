const express = require("express");

const Users = require("../helpers/userDb.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;
  const addition = { name };

  if (!name) {
    return res.status(400).json({
      errorMessage: "Please provide user's name for the post."
    });
  }
  try {
    const users = await Users.insert(addition);
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the user to the database"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await Users.get(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "The Users information could not be retrieved."
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const found = await Users.getById(id);
    if (found) {
      res.status(200).json(found);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      error: "The user information could not be retrieved."
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Users.remove(id);
    if (deleted) {
      res.send(204);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "The user could not be removed" });
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const changes = { name };
  if (!name) {
    return res.status(400).json({
      errorMessage: "Please provide user's name for the post."
    });
  }
  try {
    const update = await Users.update(id, changes);
    if (update) {
      Users.get().then(get => {
        res.status(200).json(get);
      });
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The user information could not be modified." });
  }
});

module.exports = router;
