const {
  insert,
  select,
  update1,
  deleting,
  mergeData,
} = require("../config/db");

const addSettings = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const result = await insert("settings", {
      title: title,
      description: description,
      type: type,
    });
    const [getSetting] = await select("*", "settings", { type: type });
    res.status(200).json({
      message: "Created",
      data: getSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while creating Terms and conditions.",
    });
  }
};

// const updateSettings = async (req, res) => {
//   try {
//     const { title, description, type } = req.body;
//     const result = await update1(
//       "settings",
//       {
//         title: title,
//         description: description,
//         type: type,
//       },
//       {
//         setting_id: req.params.id,
//       }
//     );
//     const [updateSetitng] = await select("*", "settings", {
//       setting_id: req.params.id,
//     });
//     if (result) {
//       res.status(200).json({
//         message: "Updated",
//         data: updateSetitng,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Error while updating",
//     });
//   }
// };

const update1Settings = async (req, res) => {
  try {
    const newData = req.body;
    const [existingData] = await select("title,description,type", "settings", {
      setting_id: req.params.id,
    });
    const exist = existingData[0];

    const merge = await mergeData(exist, newData);
    const result = await update1("settings", merge, {
      setting_id: req.params.id,
    });
    const [updateSetitng] = await select("*", "settings", {
      setting_id: req.params.id,
    });
    if (result) {
      res.status(200).json({
        message: "Updated",
        data: updateSetitng,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while updating",
    });
  }
};

const getSettings = async (req, res) => {
  try {
    const [result] = await select("*", "settings", {
      type: req.params.type,
    });
    if (result) {
      res.status(200).json({
        message: ` All ${req.params.type} settings`,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while getting the data.",
    });
  }
};

// this is dangerous as if there is no whereclause in this query then it can delete all the data of the table.
const deleteSettings = async (req, res) => {
  try {
    const result = await deleting("settings", {
      setting_id: req.params.setting_id,
    });
    if (result) {
      res.status(200).json({
        message: "Deleted",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSettings,
  update1Settings,
  getSettings,
  deleteSettings,
};
