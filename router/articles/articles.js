const express = require('express')
const ArticleController = require('../../controller/articleController')

const router = express.Router()

router.use((req, res, next) => {
    if(req.session.role !== "Author") {
        res.redirect('/login')
    } else {
        next()
    }
})

router.get("/", ArticleController.articles)
router.get("/add", ArticleController.articlesAdd)
router.post("/add", ArticleController.articlesSave)
router.get("/author", ArticleController.articlesAuthor)
router.get("/:slug/edit", ArticleController.articlesEdit)
router.post("/:slug/edit", ArticleController.articlesUpdate)
router.get("/:slug/delete", ArticleController.articlesDelete)

module.exports = router