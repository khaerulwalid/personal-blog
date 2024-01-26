const { Op } = require("sequelize");
const {Author, Profile, AuthorVisitor} = require("../models/index");

class AuthorController {
    static async authorProfiles(req, res) {
        try {
            const {userId, name, userName, role} = req.session

            // Check apakah Author Profilnya sudah dilengkapi
            let data = await Author.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: Profile
                }
            })

            data = data[0]
            if(data.Profile) {
                res.render("authorProfilesEdit", {userId, name, userName, role, data})
            } else {
                res.render("authorProfiles", {userId, name, userName, role, data})
            }

            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async authorProfilesSave(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            let AuthorId = userId
            const {motto, biography, education} = req.body

            await Profile.create({motto, biography, education, AuthorId})

            // Check apakah Author Profilnya sudah dilengkapi
            let data = await Author.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: Profile
                }
            })

            data = data[0]


            res.render("authorProfilesEdit", {userId, name, userName, role, data})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async authorProfilesUpdate(req, res) {
        try {
            const {userId, name, userName, role} = req.session
            const {id} = req.params
            let AuthorId = userId
            const {motto, biography, education} = req.body

            await Profile.update({motto, biography, education}, {
                where: {
                    id: id
                }
            })

            // Check apakah Author Profilnya sudah dilengkapi
            let data = await Author.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: Profile
                }
            })

            data = data[0]

            res.render("authorProfilesEdit", {userId, name, userName, role, data})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async removeFollower(req, res) {
        try {
            const {id} = req.params
            const {userId, name, userName, role} = req.session

            await AuthorVisitor.destroy({
                where: {
                    [Op.and]: [
                        {
                            VisitorId: id
                        },
                        {
                            AuthorId: userId
                        }
                    ]
                }
            })

            res.redirect("/articles/author")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = AuthorController