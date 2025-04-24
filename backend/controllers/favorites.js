const Favorite = require("../models/Favorite");

exports.addFavorite = async (req, res) => {
  const favorite = await Favorite.create({
    user: req.user.id,
    business: req.body.businessId,
  });
  res.status(201).json(favorite);
};

exports.removeFavorite = async (req, res) => {
  await Favorite.findOneAndDelete({
    user: req.user.id,
    business: req.params.id,
  });
  res.status(200).json({ success: true });
};
