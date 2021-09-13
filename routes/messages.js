const express = require('express');
const router = express.Router();

// Require controller modules.
const message_controller = require('../controllers/messageController');

// MESSAGE ROUTES
router.get('/', message_controller.message_list);

// Create message - get form and post
router.get('/message/message_form', message_controller.message_create_get);

router.post('/message/message_form', message_controller.message_create_post);

// Get Message detail
router.get('/message/:id', message_controller.message_detail);

// Get form and update message
router.get('/message/:id/update', message_controller.message_update_get);

router.post('/message/:id/update', message_controller.message_update_post);

// Get form and delete message
router.get('/message/:id/delete', message_controller.message_delete_get);

router.post('/message/:id/delete', message_controller.message_delete_post)

module.exports = router;