const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "api",
  })
  .promise();

const insert = async (tablename, data = {}) => {
  let columns = "";
  let placeholders = "";
  let values = [];

  if (Object.keys(data).length > 0) {
    const keys = Object.keys(data);
    columns = `(${keys.join(", ")})`;
    placeholders = `(${keys.map(() => "?").join(", ")})`;
    keys.forEach((key) => {
      values.push(data[key]);
    });
  }
  const query = `INSERT INTO ${tablename} ${columns} VALUES ${placeholders}`;

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const select = async (column, table, where) => {
  let whereclause = "";
  let values = [];

  if (Object.keys(where).length > 0) {
    const conditions = Object.keys(where).map((key, index) => {
      values.push(where[key]);
      return `${key} = ?`;
    });
    whereclause = `WHERE ${conditions.join(" AND ")}`;
  }
  const query = `SELECT ${column} FROM ${table} ${whereclause}`;
  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const update = async (table, data = {}, email) => {
  let column = "";
  let values = [];
  // console.log(email);

  if (Object.keys(data).length > 0) {
    const keys = Object.keys(data);
    // column = `(${keys.join(", ")})`
    column = `${keys.map((key) => `${key}=?`).join(", ")}`;
    keys.forEach((key) => {
      values.push(data[key]);
    });
  }

  const query = `UPDATE ${table} SET ${column} WHERE email='${email}'`;

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const update1 = async (table, data = {}, where) => {
  let whereclause = "";
  let column = "";
  let values = [];
  let updateValue = [];
  // console.log(email);

  if (Object.keys(data).length > 0) {
    const keys = Object.keys(data);
    // column = `(${keys.join(", ")})`
    column = `${keys.map((key) => `${key}=?`).join(", ")}`;
    keys.forEach((key) => {
      values.push(data[key]);
    });
  }

  if (Object.keys(where).length > 0) {
    const conditions = Object.keys(where).map((key, index) => {
      values.push(where[key]);
      return `${key}=?`;
    });
    whereclause = `WHERE ${conditions.join(" AND ")}`;
  }

  // console.log(column);
  // console.log(whereclause);
  // console.log(values);

  const query = `UPDATE ${table} SET ${column} ${whereclause}`;

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleting = async (tableName, where = {}) => {
  let whereClause = "";
  let value = [];

  if (Object.keys(where).length > 0) {
    const conditions = Object.keys(where).map((key, index) => {
      value.push(where[key]);
      return `${key}=?`;
    });
    whereClause = `WHERE ${conditions.join("AND")}`;
  }
  const query = `DELETE FROM ${tableName} ${whereClause}`;

  try {
    const result = await pool.query(query, value);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const joinQueries = async (
  first_table,
  second_table,
  firstTablePrimaryKey,
  secondTableprimaryKey,
  join,
  column = "*"
) => {
  let query = `SELECT ${column} FROM ${first_table} ${join} JOIN ${second_table} ON ${first_table}.${firstTablePrimaryKey} = ${second_table}.${secondTableprimaryKey}`;

  try {
    const result = await pool.query(query);
    return result[0];
  } catch (error) {
    console.log(error);
  }
};

const joinAllColumns = async (
  first_table,
  second_table,
  firstTablePrimaryKey,
  secondTableprimaryKey,
  join,
  column = "*"
) => {
  let query = `SELECT ${column} FROM ${first_table} ${join} JOIN ${second_table} ON ${first_table}.${firstTablePrimaryKey} = ${second_table}.${secondTableprimaryKey}`;
  // console.log(query, "queryyyy");
  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const selectWithJoin = async (
  table,
  jointable,
  col = "*",
  firsttableprimaykey = "id",
  secondtableprimaykey = "id",
  join = "INNER",
  where,
  callback
) => {
  let query = `SELECT ${col} FROM ${table} `;
  query += `${join} JOIN ${jointable} ON ${table}.${firsttableprimaykey} = ${jointable}.${secondtableprimaykey}`;

  const values = [];

  if (where) {
    query += " WHERE ";

    const conditions = Object.entries(where).map(([column, condition]) => {
      if (column.includes(".")) {
        // If the column includes '.', assume it's a fully qualified column name
        const [tableAlias, columnName] = column.split(".");
        const { value, operator = "=" } = condition;
        values.push(value);
        return `${tableAlias}.${columnName} ${operator} ?`;
      } else {
        // Otherwise, assume it belongs to the first table
        const { value, operator = "=" } = condition;
        values.push(value);
        return `${table}.${column} ${operator} ?`;
      }
    });

    query += conditions.join(" AND ");
  }

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const search = async (tablename, column, query_parameter) => {
  try {
    let query = `SELECT ${column} FROM ${tablename} WHERE p_firstName LIKE "%${query_parameter}%" OR p_lastName LIKE"%${query_parameter}%" OR price LIKE "%${query_parameter}%" OR language LIKE "%${query_parameter}%"`;
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const sorting = async (tablename, column, sortingColumn, order = "") => {
  try {
    let query = `SELECT ${column} FROM ${tablename} ORDER BY ${sortingColumn} ${order}`;
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const mergeData = async (existingData, newData) => {
  try {
    const updatedData = { ...existingData };
    for (let key in newData) {
      if (
        newData[key] != null &&
        newData[key].trim() != "" &&
        newData[key] != undefined
      ) {
        updatedData[key] = newData[key];
      }
    }
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

const pagination = async (
  column,
  tablename,
  limit = "10",
  pageNumber = "1"
) => {
  try {
    const offset = (pageNumber - 1) * limit;
    const query = `SELECT ${column} FROM ${tablename} LIMIT ${limit} OFFSET ${offset}`;
    // console.log("query hai", query);
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const totalCount = async (column, tablename) => {
  try {
    // SELECT COUNT(*) FROM `tablename`
    const query = `SELECT COUNT(${column}) as count FROM ${tablename}`;
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  insert,
  select,
  update,
  update1,
  joinQueries,
  joinAllColumns,
  selectWithJoin,
  search,
  deleting,
  sorting,
  mergeData,
  pagination,
  totalCount,
};
