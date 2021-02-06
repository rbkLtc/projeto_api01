const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users-controller');
const login = require('../middleware/login');


router.post ('/cad', UsersController.postCad);
router.post('/login', UsersController.postLogin);
router.get ('/list', UsersController.getUsers);
router.get ('/:id_user', UsersController.getUsersById);
router.patch('/', login.obg, UsersController.upDateUsers);
router.delete('/', login.obg, UsersController.deleteUsers);

module.exports = router;