var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  if (!req.user) {
    return res.render("index");
  }
  return res.redirect("/bookmarks/list");
});

module.exports = router;

// router.get("/", function (req, res, next) {
//   res.render("index");
// });
