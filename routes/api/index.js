const router = require("express").Router();
const thoughtRoutes = require("./thoughtRoutes");
const userRoutes = require("./userRoutes");

router.use("/user", userRoutes);
router.use("/thoughts", thoughtRoutes);

module.exports = router;
