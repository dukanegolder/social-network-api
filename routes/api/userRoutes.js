const router = require("express").Router();
const User = require("../../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      res.status(404).json({ message: "That user ID does not exist" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },

      { $set: req.body },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "That user ID does not exist" });
      return;
    }

    res.status(200).json({ user, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      res.status(404).json({ message: "That user ID does not exist" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },

      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "That user ID does not exist" });
      return;
    }

    res.status(200).json({ user, message: "Friend added successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },

      { $pull: { friends: req.params.friendId } },

      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "That user ID does not exist" });
      return;
    }

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
