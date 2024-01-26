const toUpperCase = require("../helper/toUpperCase");
const {Category, article, Comment, Visitor, Author} = require("../models/index");

class ArticleController {
    static async articles(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            let data = await article.findAll({
                where: {
                    AuthorId: userId
                },
                include: {
                    model: Category
                }
                
            })


            res.render("articles", {data, name, toUpperCase, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesAdd(req, res) {
        try {
            const {error} = req.query
            const {userId, name, userName, role} = req.session
            let data = await Category.findAll()

            res.render("articlesAdd", {data, userId, name, userName, role, error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesSave(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            let AuthorId = userId
            const {title, body, imageUrl, CategoryId} = req.body

            await article.create({title, body, imageUrl, CategoryId, AuthorId, role})

            res.redirect("/articles")
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                let msgError = error.errors.map(el => {
                    return el.message
                })

                res.redirect(`/articles/add?error=${msgError}`)
            } else {
                console.log(error);
                res.send(error)
            }
            
        }
    }

    static async articlesEdit(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            const {slug} = req.params
            let data = await article.findAll({
                where: {
                    slug: `${slug}`
                }
            })


            let dataC = await Category.findAll()

            data = data[0]

            res.render("articlesEdit", {dataC, data, userId, name, userName, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesUpdate(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            const {slug} = req.params
            let AuthorId = userId
            const {title, body, imageUrl, CategoryId} = req.body

            await article.update({title, body, imageUrl, CategoryId, AuthorId}, {
                where: {
                    slug: `${slug}`
                }
            })

            res.redirect("/articles")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesDelete(req, res) {
        try {
            const {slug} = req.params

            await article.destroy({
                where: {
                    slug: `${slug}`
                }
            })

            res.redirect("/articles")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesAuthor(req, res) {
        try {
            console.log("AKu masuk");
            const {userId, name, userName, role} = req.session

            let data = await Author.findOne({
                include: {
                    model: Visitor
                },
                where: {
                    id: userId
                }
            })

            console.log(data, "<<<Author");

            res.render("articlesAuthor", {data, name, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = ArticleController