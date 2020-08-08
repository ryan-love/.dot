var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var crypto = require("crypto")
var bcrypt =require("bcrypt")

var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);
const Op = Sequelize.Op
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
router.get("/", authenticationMiddleware(), (req, res) => {
console.log(req.user)
        Project.findAll({where:{userid:req.user.id},include:{model:File,/*where:{fileData: "$2b$10$Oa6ojqNWm1LhhHmuR2hlq.OpU8iiTufYdNfvof.95RIB0sq9NoaVy"}*/}}).then((data)=>{
            console.log(data)
            var t = "test";

            var dirPath = path.join(".");

            fs.readdir(dirPath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan dir ' + err);
                }
                files.forEach(function (file) {
                    // Do something with the file.
                    console.log(file);
                });
            });
            res.render("project",{project:data})
        })


});

router.post("/",(req,res)=> {

    Project.create({
        projectName: req.body.projectName,
        userid: req.user.id
    }).then((project) => {
                                const dir = `${path.join(process.cwd() + "/files")}/${project.projectID}`
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);

                                } else {
                                    res.json("Directory already exists")
                                }

    })
})



router.get("/:id", function (req,res,next) {

    Project.findOne({where:{projectID:req.params.id},include:{model:File}}).then((data)=>{
        res.render("singleProject", {data:data})
    })
})
router.get("/:id/file/:fileID", function (req,res,next) {
    console.log(req.params.fileID)
    File.findOne({where:{projectfiles:req.params.id,fileID:req.params.fileID}}).then((data)=>{
        res.render("fileEdit",{data:data})
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

router.post("/:id/decrypt", (req,res)=>{

        Project.findOne({where:{projectID:req.params.id},include:File}).then((data) => {
            for (let i = 0; i < data.Files.length; i++) {
                for (let j = 0; j < data.Files[i].fileField.length; j++) {
                        if (bcrypt.compareSync(req.body.fileData,`${data.Files[i].fileData[j]}`)){
                            res.render("fileEdit", {data:data})
                        }else {
                            return res.json({status:false,error:"Not correct value"})
                        }
                }
            }
        })
})
router.post("/:id", (req,res)=>{

    bcrypt.hash(req.body.data, 10).then((hashData) => {
        bcrypt.hash(req.body.data, 10).then((hashField) => {

            File.create({
                fileID: crypto.randomBytes(10).toString('hex'),
                fileName: req.body.name,
                fileField: [hashField],
                fileData: [hashData],
                fileType: req.body.type,
                fileComments: req.body.comments,
                projectfiles: req.params.id
            }).then((file) => {
                File.findOne({where: {fileID: file.fileID, projectfiles:req.params.id}}).then((data) => {
                    console.log(data)
                    let count = req.body.count;
                    if (!count) {
                        count = 1
                        for (let i = 0; i < count; i++) {
                            console.log("COUNT")
                            const dir = `${path.join(process.cwd() + "/files")}/${data.projectfiles}`
                            console.log(dir)
                            if (fs.existsSync(dir)) {
                                console.log("IF")
                                fs.appendFile(`${path.join(process.cwd() + "/files")}/${data.projectfiles}/${data.fileID}${data.fileType}`, `${data.fileField}=${data.fileData}\r\n`, function (err) {
                                    if (err) throw err;
                                    console.log('Saved!');
                                    res.send(data)
                                });
                            } else {
                                fs.mkdirSync(dir);
                                fs.appendFile(`${path.join(process.cwd() + "/files")}/${data.projectfiles}/${data.fileID}${data.fileType}`, `${data.fileField}=${data.fileData}\r\n`, function (err) {
                                    if (err) throw err;
                                    console.log('Saved!');
                                    res.send(data)
                                });
                            }
                        }
                    }
                })
            })
        })
    })
})

router.post("/scan",(req,res)=>{

    var dirPath = path.join(`${req.body.fileDir}`);

    fs.readdir(dirPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan dir ' + err);
        }
        files.forEach(function (file) {
            // Do something with the file.
            console.log(file);
        });
    });
    res.json({
        status:200,
        data:req.body
    })
})

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/login')
        }

    }
}

module.exports = router;