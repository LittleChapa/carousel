const Router = require('express')
const router = new Router();

const CarouselRouter = require('./carouselRouter')

router.use('/carousel', CarouselRouter)

module.exports = router;