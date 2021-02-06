const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const login = require('../middleware/login');
const LivrosController = require('../controllers/livros-controller');

//insere
router.post ('/', login.obg, upload.single(), LivrosController.postLivros);

//retorna *
router.get ('/', LivrosController.getLivros);

//retorna 1
router.get ('/:id_livro', LivrosController.getLivrosById);

//altera
router.patch('/', login.obg, LivrosController.upDateLivros);

//delete
router.delete('/', login.obg, LivrosController.deleteLivros);

module.exports = router;