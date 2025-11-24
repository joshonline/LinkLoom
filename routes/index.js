var express = require("express");
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/bookmarks/list');
  }
  res.render('index');
});

module.exports = router;

// router.get("/", function (req, res, next) {
//   res.render("index");
// });