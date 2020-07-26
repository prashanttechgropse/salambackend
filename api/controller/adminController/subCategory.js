var subCategory = require("../../../model/adminModel/subCategoryModel");
var business = require("../../../model/adminModel/businessCategoryModel");
var mongoose = require("mongoose");

var subCategoryMethod = async (req, res) => {
  try {
    const subCategoryData = await subCategory.find().and([
      {
        subcategory: req.body.subcategory,
      },
      {
        categoryId: req.body.categoryId,
      },
    ]);
    if (subCategoryData.length === 0) {
      var subcategory = new subCategory({
        businessId: req.body.businesscategory,
        categoryId: req.body.categoryId,
        subcategoryId: Date.now(),
        subcategory: req.body.subcategory,
      });
    } else {
      return res.json({
        status: false,
        message: "SubCategory Already present",
      });
    }
    await subcategory.save();
  } catch (error) {
    return res.json({ status: false, message: "Something Went Wrong" });
  } finally {
    log.save((error, saved) => {
      if (error) {
        return res.json({ status: false, message: "SubCategory Not Added" });
      } else {
        return res.json({ status: true, message: "SubCategory Added", saved });
      }
    });
  }
};

var fetchsubCategory = (req, res) => {
  try {
    subCategory
      .find({})
      .populate("businessId", "businesscategory")
      .populate("categoryId", "category")
      .then((subcategory) => {
        if (subcategory) {
          return res.json({ status: true, message: "", subcategory });
        } else {
          return res.json({ status: false, message: "Category Not Found" });
        }
      });
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

var deleteSubCategory = (req, res) => {
  try {
    var id = req.body.businessId;
    subCategory.findByIdAndRemove(id).then((doc) => {
      return res.json({
        status: false,
        message: "Poof! Your imaginary file has been deleted!",
      });
    });
  } catch (error) {
    return res.json({ status: false, message: "Something Went Wrong" });
  }
};

var editSubCategory = (req, res) => {
  try {
    let id = req.params.id;
    subCategory.findById(id, function (err, subCategory) {
      res.json(subCategory);
    });
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

var updateSubCategory = (req, res) => {
  try {
    let id = req.params.id;

    subCategory
      .findByIdAndUpdate(id, { $set: { subcategory: req.body.Subcategory } })
      .then(
        (user) => {
          if (user) {
            return res.json({
              status: true,
              message: "SubCategory Updated",
              user,
            });
          } else {
            return res.json({
              status: false,
              message: "SubCategory Not Found",
            });
          }
        },
        (e) => {
          return res.json({
            status: false,
            message: "Subcategory Not Updated",
          });
        }
      );
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

var fetchsubCategoryId = (req, res) => {
  try {
    subCategory
      .find({ categoryId: mongoose.Types.ObjectId(req.body.category) })
      .then((subcategory) => {
        if (subcategory) {
          return res.json({ status: true, message: "", subcategory });
        } else {
          return res.json({ status: false, message: "Category Not Found" });
        }
      });
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

module.exports = {
  subCategoryMethod,
  fetchsubCategory,
  deleteSubCategory,
  editSubCategory,
  updateSubCategory,
  fetchsubCategoryId,
};
