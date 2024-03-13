const { Thought, User } = require("../models");

const thoughtController = {
  // Get all Thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Get one Thought by id
  async getThoughtById(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.id })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Create Thought and push the created thought's _id to the associated user's thoughts array field
  async createThought(req, res) {
    try {
      const { _id } = await Thought.create(req.body);
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "Thought created but no user with this id!" });
      }

      res.json({ message: "Thought successfully created!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update Thought by id
  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought found with this id!" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Delete Thought
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({ _id: req.params.id });

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      const dbUserData = await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "Thought deleted but no user found with this thought!" });
      }
      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add reaction
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Delete reaction
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id to remove reaction from" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
