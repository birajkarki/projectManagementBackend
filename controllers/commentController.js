const Comment = require('../models/Comment');
const Task = require('../models/Task');

exports.addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const comment = new Comment({
      text,
      user: req.user.id,
      task: req.params.taskId,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Comment.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
