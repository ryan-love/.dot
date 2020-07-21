var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var crypto = require("crypto")

var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);

// Import models
const Project = sequelize.import("../db/models/project")
const File = sequelize.import("../db/models/file")
const User = sequelize.import("../db/models/user")



//Relationships
Project.belongsTo(User,{foreignKey:"userid"});
User.hasMany(Project,{foreignKey:"userid"})
File.belongsTo(Project,{foreignKey:"projectfiles",targetKey:"projectID"});
Project.hasMany(File,{foreignKey:"projectfiles",sourceKey:"projectID"})




/* GET users listing. */
router.get("/", (req, res) => {

        Project.findAll({include:File,where:{userid:7}}).then((data)=>{
            console.log(data)
            res.render("project",{project:data})
        })


});

router.post("/",(req,res)=>{
    Project.create({
        projectName: req.body.projectName,
        userid: 2 //req.user
    }).then( (project) =>{
    File.create({
        fileID: crypto.randomBytes(10).toString('hex'),
        fileName: req.body.name,
        fileField: [req.body.field],
        fileData: [req.body.data],
        fileType: req.body.type,
        fileComments: req.body.comments,
        projectfiles: project.projectID
    }).then((file)=>{
        File.findOne({where:{fileID:file.fileID}}).then((data)=>{
            console.log(data)
            let count = req.body.count;
            if(!count) {
                count = 1

                for (let i = 0; i < count; i++) {
                    const dir = `${path.join(process.cwd() + "/files")}/${data.projectfiles}`
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);

                        fs.appendFile(`${path.join(process.cwd() + "/files")}/${data.projectfiles}/${data.fileID}${data.fileType}`, `${data.fileField}=${data.fileData}\r\n`, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                            res.send(data)
                        });
                    }
                }
            }
        })})


    })




})

router.get("/env/download", function (req,res,next) {
    File.findOne({
        where: { projectfiles: "1006d283-4bce-4182-a184-e1573a6400dc"}
    }).then((data) => {
        res.download(`${path.join(process.cwd() + "/files")}/${data.projectfiles}/${data.fileID}${data.fileType}`, ".env", err => {
            if (err) console.log(err);
        })


    })
})



function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            User.findOne({where: {id: req.user.id}}).then((uID) => {

            })
        } else  {
            res.redirect('/login')
        }

    }
}

module.exports = router;