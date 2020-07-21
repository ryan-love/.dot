'use strict';
module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        fileID: DataTypes.STRING,
        fileName: DataTypes.STRING,
        fileField: DataTypes.ARRAY(DataTypes.STRING),
        fileData: DataTypes.ARRAY(DataTypes.STRING),
        fileType: DataTypes.STRING,
        fileComments: DataTypes.STRING,
        projectfiles:{
            type:DataTypes.UUID,
            defaultValue:sequelize.UUIDV4
        }
    }, {});

    return File;
};