const express = require('express')
const Controller = require('../controller/controller')
const router = express.Router()
const authorRouter = require("./authors/authors")
const articleRouter = require("./articles/articles")

const middleware = function (req, res, next) {
    if(req.session.role) {
        res.redirect('/')
    } else {
        next()
    }
}

const midOut = function (req, res, next) {
    if(req.session.role) {
        next()
    } else {
        res.redirect('/login')
    }
}

const visitor = function (req, res, next) {
    if(req.session.role === "Visitor") {
        next()
    } else {
        res.redirect('/')
    }
}

router.get("/", Controller.home)
router.get("/login", middleware, Controller.login)
router.post("/login", middleware, Controller.loginCheck)
router.get("/register", middleware, Controller.register)
router.post("/register", middleware, Controller.registerSave)
router.get("/logout", midOut, Controller.logout)
router.get("/visitor", visitor, Controller.visitorFollow)
router.use("/authors", authorRouter)
router.use("/articles", articleRouter)
router.post("/:id/comments", Controller.articlesComments)
router.get("/:id/authordetail", Controller.authorDetail)
router.get("/:slug", Controller.detail)
router.get("/:id/follow", midOut, Controller.authorFollow)
router.get("/:id/unfollow", midOut, Controller.authorUnfollow)


module.exports = router