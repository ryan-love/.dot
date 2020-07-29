var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt")
var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);
const Project = sequelize.import("../db/models/project")
const File = sequelize.import("../db/models/file")
const User = sequelize.import("../db/models/user")

//Relationships
Project.belongsTo(User,{foreignKey:"userid"});
User.hasMany(Project,{foreignKey:"userid"})
File.belongsTo(Project,{foreignKey:"projectfiles",targetKey:"projectID"});
Project.hasMany(File,{foreignKey:"projectfiles",sourceKey:"projectID"})

passport.use('local', new LocalStrategy(
    {// by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
        var isValidPassword = function (userpass, password) {
            return bcrypt.compareSync(password, userpass);
        }
        console.log("logged to", email)
        User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            console.log(user)
            if (!user) {
                return done(null, false, {
                    message: 'Email does not exist'
                });
            }
            if (!isValidPassword(user.password, password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            var userinfo = user.get();
            return done(null, userinfo);
        }).catch(function (err) {
            console.log("Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }
));

//serialize
passport.serializeUser(function (auth, done) {
    done(null, auth.id);
});

// deserialize user
passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
})

/* GET users listing. */


router.post("/register", (req,res) =>{

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10 , (err,hash) => {
        User.create({
            firstName:firstName,
            lastName:lastName,
            email: email,
            password: hash,
        }).then((results,err)=>{
            if (err) throw err;
            console.log(results)
            User.findOne({where:{id:results.id}}).then((uID,err)=>{
                req.login(uID , ()=>{
                    res.redirect("/project")
                })

            });
        })
    })
});


router.post('/',passport.authenticate('local'),authenticationMiddleware(),
    function(req, res) {
        res.redirect("/project")
    }
);

router.get("/", function (req,res) {

    res.render("login",{title: "Login"})
})

router.get("/logout", (req,res)=>{
    req.session.destroy();
    req.logout();
    console.log(req.session)
    res.redirect("/login")

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