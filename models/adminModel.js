const DBHELPER = require("../config/db");

class AdminModel {
  static async registerAdmin(table, payload) {
    try {
      return DBHELPER.insert(table, payload);
      // return newAdmin;
    } catch (error) {
      console.log(error);
      throw new Error(`Error creating admin ${error.message}`);
    }
  }
  // static async fetchData({table, filter}){
  //     try {
  //         const isDocsExist = await new Promise((resolve, reject) => {
  //             DBHELPER.select("*", "admin", {email : email}, (docs) => {
  //                 resolve(docs)
  //             })
  //         })
  //         return isDocsExist
  //     } catch (error) {
  //         throw new Error(`Error in checking the document in DB ${error.message}`)
  //     }
  // }
  static async getAdmin(email) {
    try {
      const isAdminExist = await new Promise((resolve, reject) => {
        DBHELPER.select("*", "admin", { email });
      });
    } catch (error) {}
  }
}

module.exports = AdminModel;
