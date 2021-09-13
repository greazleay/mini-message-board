const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const message = require('../models/message');

// Display list of all messages
exports.message_list = (req, res, next) => {
    // res.send('Not yet implemented!!!')
    Message.find().exec((err, list_message) => {
        if (err) return next(err);
        res.render('index', { title: 'Mini Message Board', message_list: list_message}) 
    })
}

// Display detail page for specific message
exports.message_detail = function (req, res, next) {
    // res.send('Not yet implemented!!!')
    Message.findById(req.params.id).exec((err, message) => {
        // console.log(req)
        if (err) return next(err)
        if(!message) {
            const err = new Error('Message not found');
            err.status = 404;
            return next(err);
        }
        res.render('message_detail', { title: 'Message Details', message: message});
        console.log(message)
    })
}

// Display Message create form on GET
exports.message_create_get = function (req, res) {
    res.render('message_form', { title: 'Add New Message'})
}

// Handle Message create on POST
exports.message_create_post = [
    
    body('user', 'Please Tell us your name').trim().isLength({ min: 1 }).escape(),
    body('text', 'Please add your message').trim().isLength({ min: 1 }).escape(),
    
    function (req, res, next) {
    
        const errors = validationResult(req);

        const message = new Message({
            user: req.body.user,
            text: req.body.text,
            date_added: new Date()
        });

        if (!errors.isEmpty()) {
            Message.find({}, 'user').exec(function (err, message) {
                if (err) return next(err)
                res.render('message_form', { title: 'Add new message', errors: errors.array(), message: message, });
                return;
            })
        } else {
            message.save(function (err) {
                if (err) return next(err);
                res.redirect(message.url)
            })
        }
}]

// Display Message Update form on GET
exports.message_update_get = (req, res, next) => {
    Message.findById(req.params.id).exec((err, message) => {
        if (err) return next(err)
        if (!message) {
            const err = new Error('Message not found');
            err.status = 404;
            return next(err);
        };
        res.render('message_form', { title: 'Update Message', message: message})
    })
}

// Handle Message create on POST
exports.message_update_post = [
    
    body('user', 'What is your name').trim().isLength({ min: 1 }).escape(),
    body('text', 'Please add your message').trim().isLength({ min: 1 }).escape(),


    (req, res, next) => {
        const errors = validationResult(req);

        const message = {
            user: req.body.user,
            text: req.body.text,
            date_added: new Date()
        }

        if (!errors.isEmpty()) {
            Message.find({}, 'user').exec(function (err, message) {
                if (err) return next(err)
                res.render('message_form', { title: 'Update Message', errors: errors.array(), message: message})
            })
        } else {
            Message.findByIdAndUpdate(req.params.id, message, {}, function (err, themessage) {
                res.redirect(themessage.url)
            })
        }
}]

// Display Message Delete on GET
exports.message_delete_get = (req, res, next) => {
    Message.findById(req.params.id).exec(function (err, message) {
        if (err) return next(err);
        if (!message) {
            const err = new Error('Message not found');
            err.status = 404;
            return next(err);
        }
        res.render('message_delete', { title: 'Delete Message', message: message})
    })
}

// Handle Message Delete on POST
exports.message_delete_post = (req, res, next) => {
    Message.findByIdAndDelete(req.body.messageid, function (err) {
        if (err) return next(err)
        res.redirect('/messages')
    })
}