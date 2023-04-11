const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/my-collection", (req, res) => {
  const { knexBuilder, user } = req;
  const { favourite_moves } = knexBuilder.from("users").where(id, user.id);
  return res.status(200).type("json").send({ status: "ok", favourite_moves });
});
