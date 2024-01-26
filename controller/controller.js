
const { Op } = require("sequelize");
const {Author, Visitor, Category, article, Comment, Profile, AuthorVisitor} = require("../models/index");
const bcrypt = require('bcryptjs');

class Controller {
    static async home(req, res) {
        try {
            const {order} = req.query
            const {userId, name, userName, role} = req.session

            let data = await article.getNews(order)

            res.render("home", {data, name, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async detail(req, res) {
        try {
            const {slug} = req.params
            const {userId, name, userName, role} = req.session
            console.log("Masuk");
            let el = await article.findOne({
                where: {
                    slug: `${slug}`
                },
                include: [
                    {
                        model: Author
                    },
                    {
                        model: Category
                    }
                ]
            })

            let comments = await Comment.findAll({
                where: {
                    ArticleId: el.id
                },
                include: [
                    {
                        model: Visitor
                    },
                    {
                        model: article
                    }
                ]
            })

            res.render("detail", {el, name, comments, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            res.render("register")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            const {error} = req.query

            res.render("login", {error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async loginCheck(req, res) {
        try {
            const {userName, password, role} = req.body
            
            let data
            let errors = "Your username or password wrong"

            if(role === "Author") {
                data = await Author.findAll({
                    where: {
                        userName: `${userName}`
                    }
                })
                
                
                if(data.length !== 0) {
                    data = data[0]
                    let isValidPassword = bcrypt.compareSync(password, data.password);
            
                    if (isValidPassword) {
                        // set session
                        req.session.userId = data.id
                        req.session.name = data.name
                        req.session.userName = data.userName
                        req.session.role = data.role

                        return res.redirect("/authors/profiles")
                    } else {
                        return res.redirect(`/login?error=${errors}`)
                    }
                }
            
                res.redirect(`/login?error=${errors}`)

                
            } else if (role === "Visitor") {
                data = await Visitor.findAll({
                    where: {
                        userName: userName
                    }
                })
                
                if(data.length !== 0) {
                    data = data[0]
                    let isValidPassword = bcrypt.compareSync(password, data.password);
            
                    if (isValidPassword) {
                        // set session
                        req.session.userId = data.id
                        req.session.name = data.name
                        req.session.userName = data.userName
                        req.session.role = data.role

                        return res.redirect("/")
                    } else {
                        return res.redirect(`/login?error=${errors}`)
                    }
                }
            
                res.redirect(`/login?error=${errors}`)
            }

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async registerSave(req, res) {
        try {
            const {name, gender, birthDay, role, userName, password} = req.body

            if(role === "Author") {
                await Author.create({name, gender, birthDay, role, userName, password})
            } else if (role === "Visitor") {
                await Visitor.create({name, gender, birthDay, role, userName, password})
            }

            res.redirect("/login")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/login")
                }
            })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async articlesComments(req, res) {
        try {
            const {id} = req.params
            const {userId, name, userName, role} = req.session
            const {body} = req.body
            let VisitorId = userId
            let ArticleId = id

            let data = await article.findByPk(id)

            await Comment.create({body, VisitorId, ArticleId})

            res.redirect(`/${data.slug}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async authorDetail(req, res) {
        try {
            const {id} = req.params
            const {userId, name, userName, role} = req.session
            let AuthorId = id
            let VisitorId = userId

            let data = await article.findAll({
                where: {
                    AuthorId: id
                },
                include: [
                    {
                        model: Category
                    },
                    {
                        model: Author,
                        include: {
                            model: Profile,
                            where: {
                                AuthorId: id
                            }
                        }
                    }
                ]
            })


            let dataFollow
            if(VisitorId) {
                dataFollow = await AuthorVisitor.findOne({
                    where: {
                        [Op.and]: [
                            {
                                VisitorId: VisitorId
                            },
                            {
                                AuthorId: AuthorId
                            }
                        ]
                    }
                })
            }
            

            res.render("authorDetail", {data, name, role, dataFollow})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async authorFollow(req, res) {
        try {
            const {id} = req.params
            const {userId, name, userName, role} = req.session
            let AuthorId = id
            let VisitorId = userId

            await AuthorVisitor.create({AuthorId, VisitorId})

            

            res.redirect(`/${id}/authordetail`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    } 

    static async authorUnfollow(req, res) {
        try {
            const {id} = req.params
            const {userId, name, userName, role} = req.session
            let AuthorId = id
            let VisitorId = userId

            await AuthorVisitor.destroy({
                where: {
                    [Op.and]: [
                        {
                            AuthorId: AuthorId
                        },
                        {
                            VisitorId: VisitorId
                        }
                    ]
                }
            })

            res.redirect(`/${id}/authordetail`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async visitorFollow(req, res) {
        try {
            const {userId, name, userName, role} = req.session

            let data = await Visitor.findOne({
                include: {
                    model: Author
                },
                where: {
                    id: userId
                }
            })

            res.render("visitorFollow", {data, name, role})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    } 


}

module.exports = Controller