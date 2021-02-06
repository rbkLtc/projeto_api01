const express = require('express');
const router = express.Router();
const AvalController = require('../controllers/aval-controller');

//insere
router.post ('/', AvalController.postAval);

//select *
router.get ('/', AvalController.getAval);

//select 1
router.get ('/:id_aval', AvalController.getAvalbyId);

//delete
router.delete('/', AvalController.deleteAval);

module.exports = router;