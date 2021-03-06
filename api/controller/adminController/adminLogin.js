var admin = require("../../../model/adminModel/adminModels");
var vendor = require("../../../model/vendorModel/model/vendorSchema");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var JWTSECRET = "shivendra123";

var adminSignup = (req, res) => {
  try {
    admin.findOne({ email: req.body.email }).then((doc) => {
      var pass = bcrypt.hashSync(req.body.password);
      var Admin = new admin({
        email: req.body.email,
        password: pass,
      });
      Admin.save((error, save) => {
        if (error) {
          return res.json({ status: false, message: "user Not Saved" });
        } else {
          return res.json({ status: true, message: "user Saved" });
        }
      });
    });
  } catch (error) {
    return res.json({ status: false, message: "Something Went Wrong" });
  }
};

var adminLogin = (req, res) => {
  try {
    const log = {
      email: req.body.email,
      password: req.body.password,
    };
    admin.findOne({ email: log.email }).then(async (user) => {
      if (!user) {
        return res.json({ status: false, message: "User Not Found" });
      }
      if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const token = jwt.sign({ _id: user._id }, JWTSECRET);
          return res.json({
            status: true,
            message: "Login SuccessFully",
            token: token,
            email: user.email,
            userId: user._id,
          });
        } else {
          return res.json({ status: false, message: "Password Not Matched" });
        }
      } else {
        return res.json({
          status: false,
          message: "Email or Password Incorrect",
        });
      }
    });
  } catch (error) {
    return res.json({ status: false, message: "Something Went Wrong" });
  }
};

var adminLogout = (req, res) => {
  try {
    res.clearCookie("jwtToken");
    return res.json({
      status: true,
      message: "Logout SuccessFully",
    });
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

var fetchVendor = (req, res) => {
  try {
    vendor
      .findById({ _id: mongoose.Types.ObjectId(req.body.vendorId) })
      .then((doc) => {
        if (doc) {
          return res.json({
            status: true,
            message: "",
            image: doc.image,
            name: doc.name,
            email: doc.email,
            mobile: doc.mobile,
            adminStatus: doc.adminStatus,
            vendorId: doc._id,
            address: doc.address,
            accountType: doc.accountType,
            city: doc.city,
            streetName: doc.streetName,
            storeEmail: doc.storeEmail,
          });
        }
      });
  } catch (error) {
    return res.json({ status: false, message: "SomeThing Went Wrong" });
  }
};

module.exports = { adminSignup, adminLogin, fetchVendor, adminLogout };
