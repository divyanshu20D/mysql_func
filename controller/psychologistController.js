const {
  insert,
  select,
  update,
  update1,
  joinQueries,
  joinAllColumns,
  selectWithJoin,
  search,
  sorting,
  totalCount,
  pagination,
  mergeData,
} = require("../config/db");

const addPsychologist = async (req, res) => {
  try {
    const {
      User_assigned,
      p_firstName,
      p_lastName,
      p_email,
      price,
      language,
      p_age,
      gender,
    } = req.body;
    const [check] = await select("*", "psychologist", { p_email: p_email });
    if (check.length > 0) {
      return res.status(400).json({
        message: "A Psychologist with this user already exist",
      });
    } else {
      const result = await insert("psychologist", {
        User_assigned: User_assigned,
        p_firstName: p_firstName,
        p_lastName: p_lastName,
        p_email: p_email,
        price: price,
        language: language,
        p_age: p_age,
        gender: gender,
      });
      const [getPsychologist] = await select("*", "psychologist", {
        p_email: p_email,
      });
      res.status(200).json({
        data: getPsychologist,
        message: "Phsychologist created",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while creating Psychologist",
    });
  }
};

const completeProfile = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const file = req.files;
  const result = await update1(
    "psychologist",
    { p_profilePic: file[0].path },
    { id: req.params.id }
  );

  const [psycho] = await select("*", "psychologist", { id: req.params.id });
  res.json({
    data: req.files,
    message: "File uploaded successfully",
    psychologist: psycho,
  });
};

const getAllActivePsychologist = async (req, res) => {
  try {
    const [result] = await select("*", "psychologist", { status: "Active" });

    if (result) {
      res.status(200).json({
        data: result,
        message: "All Active Psychologists",
      });
    } else {
      res.status(400).json({
        message: "No Active users",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error while getting all Active Psychologists",
    });
  }
};

const getAllPsychologist = async (req, res) => {
  try {
    const [result] = await select("*", "psychologist", "");
    console.log("after result");
    if (result) {
      console.log("inside if");
      res.status(200).json({
        data: result,
        message: "All Psychologist",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      messge: "Error while getting all Psychologists.",
    });
  }
};

const getParticularPsychologist = async (req, res) => {
  try {
    const [result] = await select("*", "psychologist", { id: req.params.id });
    if (result) {
      res.status(200).json({
        message: "Psychologist with that particular ID",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "No Psychologist with that particular ID.",
    });
  }
};

const deletePsychologist = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await update1(
      "psychologist",
      { status: "Deleted" },
      { id: id }
    );
    if (result) {
      res.status(200).json({
        messge: "Psychologist Deleted.",
      });
    }
  } catch (error) {
    console.log(error),
      res.status(400).json({
        message: "Error while deleting psychologist.",
      });
  }
};

const updatePsychologist = async (req, res) => {
  try {
    const newData = req.body;
    const [existingData] = await select(
      "p_firstName,p_lastName,price,language,p_age,gender",
      "psychologist",
      { id: req.params.id }
    );
    const exist = existingData[0];
    const merge = await mergeData(exist, newData);

    const result = await update1("psychologist", merge, { id: req.params.id });
    const [updatePsychologist] = await select("*", "psychologist", {
      id: req.params.id,
    });
    if (result) {
      res.status(200).json({
        message: "Psychologist Updated",
        Updated_Psychologist: updatePsychologist,
      });
    }
  } catch (error) {
    console.log(error),
      res.status(400).json({
        message: "Error while Updating Psychologist",
      });
  }
};

const getAppointments = async (req, res) => {
  try {
    const result = await joinAllColumns(
      "psychologist",
      "admin",
      "user_assigned",
      "admin_id",
      "LEFT",
      "*"
      // "p_firstName, p_lastName, p_email, first_name, last_name"
    );
    const [temp] = result[0];
    const psychologist = {
      Id: temp.id,
      Name: `${temp.p_firstName} ${temp.p_lastName}`,
      Contacts: temp.p_email,
      Age: temp.age,
      Gender: temp.gender,
    };
    const User = {
      Id: temp.admin_id,
      Name: `${temp.first_name} ${temp.last_name}`,
      Contacts: temp.email,
    };
    // console.log(temp);
    if (result) {
      res.status(200).json({
        message: "Join admin and psychologist tables",
        data: {
          Psychologist: psychologist,
          Assigned_User: User,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while getting all the appointments.",
    });
  }
};

const checkAppointments = async (req, res) => {
  try {
    const result = await joinQueries(
      "psychologist",
      "admin",
      "user_assigned",
      "admin_id",
      "LEFT",
      "*"
      // "admin.first_name as userName,psychologist.p_firstName as petname"
    );
    if (result) {
      // const results = [];
      // const temp = result[0];
      // console.log("temp", temp);
      // for (let i = 0; i < result[0].length - 1; i++) {
      //   const data = {
      //     Psychologist: {
      //       Id: temp[i].id,
      //       Name: `${temp[i].p_firstName} ${temp[i].p_lastName}`,
      //       Contacts: temp[i].p_email,
      //       Age: temp[i].age,
      //       Gender: temp[i].gender,
      //     },
      //     User_Assigned: {
      //       Id: temp[i].admin_id,
      //       Name: `${temp[i].first_name} ${temp[i].last_name}`,
      //       Contacts: temp[i].email,
      //     },
      //   };
      //   console.log("data", data);
      //   results.push(data);
      // }
      res.status(200).json({
        message: "Joined specific columns of admin and psychologist tables",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while fetching data",
    });
  }
};

const joinsChecking = async (req, res) => {
  try {
    const result = await selectWithJoin(
      "psychologist",
      "admin",
      "*",
      "user_assigned",
      "admin_id",
      "INNER",
      {
        "psychologist.id": { value: req.params.id, operator: "=" },
      }
    );
    const [temp] = result[0];
    const psychologist = {
      Id: temp.id,
      Name: `${temp.p_firstName} ${temp.p_lastName}`,
      Contacts: temp.p_email,
      Age: temp.age,
      Gender: temp.gender,
    };
    const User = {
      Id: temp.admin_id,
      Name: `${temp.first_name} ${temp.last_name}`,
      Contacts: temp.email,
    };
    if (result) {
      res.status(200).json({
        message: "Done",
        data: {
          Psychologist: psychologist,
          Assigned_User: User,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while joining",
    });
  }
};

const searchPsychologist = async (req, res) => {
  try {
    const [result] = await search("psychologist", "*", req.params.filter);
    // console.log(result);
    if (result) {
      res.status(200).json({
        data: result,
        message: "Psychologist with the search query.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while searching",
    });
  }
};

const sortPsychologist = async (req, res) => {
  try {
    const sort = req.params.sort;
    const [result] = await sorting("psychologist", "*", sort);
    if (result) {
      res.status(200).json({
        message: `Psychologist sorted based on ${req.params.sort}`,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while sorting.",
    });
  }
};

const paginatedPsychologist = async (req, res) => {
  try {
    // const { limit, pageNumber } = req.body;
    // console.log(req.body);
    // console.log("limit hai", limit);
    // console.log("offset hai", offset);
    const [result] = await pagination(
      "*",
      "psychologist",
      req.query.limit,
      req.query.pageNumber
    );
    const [total] = await totalCount("*", "psychologist");
    if (result) {
      res.status(200).json({
        message: "Paginated Result",
        Total_Num_of_Psychologist: total[0].count,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while paginating",
    });
  }
};

const bookingAction = async (req, res) => {
  try {
    const { action } = req.body;
    const updating = await update1(
      "bookings",
      { session_status: action },
      { booking_id: req.params.bookingId }
    );
    if (updating) {
      res.status(200).json({
        mesage: "Action done.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while taking action on booking.",
    });
  }
};

const viewAllAcceptedBookings = async (req, res) => {
  try {
    const [allBookings] = await select("*", "bookings", {
      session_status: "Accepted",
    });
    if (allBookings) {
      res.status(200).json({
        message: "All Accepted bookings",
        data: allBookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while showing all acceoted bookings",
    });
  }
};

const viewCanceledSession = async (req, res) => {
  try {
    const [canceledSession] = await select("*", "bookings", {
      session_status: "Canceled",
    });
    if (canceledSession) {
      res.status(200).json({
        message: "All canceled sessions.",
        data: canceledSession,
      });
    }
  } catch (error) {}
};

module.exports = {
  addPsychologist,
  getAllActivePsychologist,
  getAllPsychologist,
  getParticularPsychologist,
  deletePsychologist,
  updatePsychologist,
  getAppointments,
  checkAppointments,
  joinsChecking,
  searchPsychologist,
  sortPsychologist,
  paginatedPsychologist,
  completeProfile,
  bookingAction,
  viewAllAcceptedBookings,
  viewCanceledSession,
};
