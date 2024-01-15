const models = require("../models");
  
function uploadFile(req, res) {
 const fileName = req.file.filename;
  
      models.Upload.create({ file: fileName }) 
        .then((result) => {
          res.status(200).json({
            message: "File uploaded successfully",
            fileName: fileName,
            success: true,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Something went wrong",
            error: error,
            success: false,
          });
        });
  
  }
  
  module.exports = {

    uploadFile:uploadFile,
  };