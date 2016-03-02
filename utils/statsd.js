module.exports = function(stat) {
  return function (req, res, next) {
    var method = req.method || "unknown_method";
    req.statsdKey = ["newsletter api", method.toLowerCase(), stat].join(".");
    next();
  };
}
