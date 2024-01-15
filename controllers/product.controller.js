const models = require("../models");
  
function create(req, res) {
  const fileName = req.file.filename;
 const prod = {
              name: req.body.name,
              category: req.body.category,
              description: req.body.description,
              price:req.body.price,
              size:req.body.size,
              deliveryFee:req.body.deliveryFee,
              pic:fileName,
              
            };
            models.Product.create(prod)
              .then((result) => {
                res.status(200).json({
                  message: "Product created Successfully",
                  success: true,
                  data: result,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong..",
                });
              });
          };
function index(req, res) {
            models.Product.findAll()
              .then((result) => {
                res.status(200).json({
                  success: true,
                  data: result,
                  message: "Product fetched",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "something went wrong!",
                });
              });
          }     
function getById(req, res) {
  const id = req.params.id;
  models.Product.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json({ data: result, success: true });
      } else {
        res.status(404).json({
          message: "Product not found",
          success: false,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "something went wrong!",
      });
    });
}



function destroy(req, res) {
  const id = req.params.id;

  models.Product.destroy({ where: { id: id } })
    .then((result) => {
      if (result.pic != "") {
        try {
          fs.unlinkSync("./uploads/" + result.dp.split(""));
        } catch (err) {
          console.log(err);
        }
      }
      if (result > 0) {
        // Check if any rows were affected (user deleted)
        res.status(200).json({
          message: "Product deleted successfully",
        });
      } else {
        // No rows affected, user with the specified ID not found
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Something went wrong",
        error: error.message, // Provide more information about the error
      });
    });
}
const get_guest_product_details = async (req, res) => {
  
      res.render("../views/pages/guest/product-details.ejs", {
        title: "Teemarh's Delight",
        layout: "../views/layouts/full-width.ejs",
     
      });
  
       
          };
module.exports = {
  create: create,
  index: index,
  get_guest_product_details:get_guest_product_details,
  getById: getById,
  destroy: destroy,
};
