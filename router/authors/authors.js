const express = require('express')
const AuthorController = require('../../controller/authorController')

const router = express.Router()

router.use((req, res, next) => {
    if(req.session.role !== "Author") {
        res.redirect('/login')
    } else {
        next()
    }
})

router.get("/profiles", AuthorController.authorProfiles)
router.post("/profiles", AuthorController.authorProfilesSave)
router.get("/:id/removeFollower", AuthorController.removeFollower)
router.post("/profiles/:id/edit", AuthorController.authorProfilesUpdate)



module.exports = router