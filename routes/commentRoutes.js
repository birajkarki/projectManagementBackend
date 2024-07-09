const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:taskId/comments', authMiddleware, addComment);
router.get('/:taskId/comments', authMiddleware, getComments);
router.delete('/:taskId/comments/:id', authMiddleware, deleteComment);

module.exports = router;
