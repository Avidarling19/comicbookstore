// routes/comicRoutes.js
const express = require('express');
const comicController = require('../controllers/maincontroller.js');
const router = express.Router();

router.post('/comics', comicController.createComic);
router.put('/comics/:id', comicController.updateComic);
router.delete('/comics/:id', comicController.deleteComic);
router.get('/comics', comicController.getComics);
router.get('/comics/:id', comicController.getComicDetails);

module.exports = router;
