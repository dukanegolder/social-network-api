const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();

    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    if (!thought) {
      res.status(404).json({ message: "That thought ID does not exist" });
      return;
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body).then((newThought) => {
      return User.findOneAndUpdate(
        { username: req.body.username },

        { $push: { thoughts: { _id: newThought._id } } },
        { new: true }
      );
    });

    res.status(200).json({ thought });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "That thought ID does not exist" });
      return;
    }

    res.status(200).json({ thought, message: "Thought updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    }).then(() => {
      return User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },

        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
    });

    if (!thought) {
      res.status(404).json({ message: "That thought ID does not exist" });
      return;
    }

    res.status(200).json({ message: "Thought deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },

      { $addToSet: { reactions: req.body } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "That thought ID does not exist" });
      return;
    }

    res.status(200).json({ thought, message: "Reaction added successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },

      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "That thought ID does not exist" });
      return;
    }

    res
      .status(200)
      .json({ thought, message: "Reaction deleted successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
