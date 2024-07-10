const createSetting = (req, res, next) => {
  try {
    const { title, description, type } = req.body;
    const Types = ["Privacy", "Terms", "About"];
    if (!Types.includes(type)) {
      return res.status(400).json({
        message: `Type needs to be either 'Privacy', 'Terms' or 'About `,
      });
    }

    if (!title) {
      return res.status(400).json({
        message: `Title field can't be empty.`,
      });
    }

    if (!description) {
      return res.status(400).json({
        message: `Description can't be empty.`,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while validating settings",
    });
  }
};

module.exports = {
  createSetting,
};
