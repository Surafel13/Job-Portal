const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get conversation with a specific user
router.get('/messages/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent conversations
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Find unique user IDs that the current user has chatted with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", currentUserId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      }
    ]);

    // Populate user info
    const populated = await Promise.all(conversations.map(async (c) => {
      const user = await User.findById(c._id).select('name email role');
      return {
        user,
        lastMessage: c.lastMessage
      };
    }));

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark messages as read
router.put('/read/:otherUserId', verifyToken, async (req, res) => {
    try {
      const { otherUserId } = req.params;
      const currentUserId = req.user.id;
  
      await Message.updateMany(
        { senderId: otherUserId, receiverId: currentUserId, read: false },
        { $set: { read: true } }
      );
  
  
      res.json({ message: 'Messages marked as read' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/unread-count', verifyToken, async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const count = await Message.countDocuments({ receiverId: currentUserId, read: false });
      res.json({ unreadCount: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
