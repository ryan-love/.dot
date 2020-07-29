'use strict';
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define('Settings', {
        id:{

            type: DataTypes.UUID,
            defaultValue:sequelize.UUIDV4,
            primaryKey:true
        },
        setAp: {
            type: DataTypes.JSONB
        },
        setAPI: {
            type: DataTypes.JSONB
        },
        setCrypto: {
            type: DataTypes.JSONB
        },
        setGit: {
            type: DataTypes.JSONB
        },
        setDB: {
            type: DataTypes.JSONB
        },
        setApp: {
            type: DataTypes.JSONB
        },
        userID: DataTypes.INTEGER
    }, {
        timestamps:false
    });

    var setAp = {
        theme: "dark",
        font: {
            fontFamily: "Open Sans",
            fontURL: "url",
            fontWeight: "300"
        }
    }
    var setAPI = {
        enableAPI:true,
    }
    var setCrypto = {
        encryption: "default",
        hashing: "default",
        unsecure:false
    }
    var setGit = {
        gitUser:{

        },
        repository: {

        }
    }
    var setDB = {
        db:{
            type:"PostgreSQL",
            port:"1234",
            URI:"127.0.0.1",
            user:"user",
            password:"password",
            stage:"development"
        }
    }
    var setApp = {
        gdpr:true
    }

    return Settings;
};