const Router = require('express');
const router = new Router();

const CarouselController = require("../controllers/carouselController")

router.get('/', CarouselController.getAllImages)
router.post('/', CarouselController.addImage)
router.delete('/:imageName', CarouselController.deleteImage)

module.exports = router;