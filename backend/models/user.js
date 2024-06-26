"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/
  static async register({username, password, email, isAdmin}) {
    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username])

    if (duplicateCheck.rows[0]) throw new BadRequestError("Username already taken.")

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const res = await db.query(
      `INSERT INTO users
      (username, password, email, is_admin)
      VALUES ($1, $2, $3, $4)
      RETURNING username, email, is_admin AS "isAdmin"`,
      [username, hashedPassword, email, isAdmin]
    )
    return res.rows[0]
  }

      /** authenticate user with username, password.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    const res = await db.query(`
      SELECT username, password, email, is_admin AS "isAdmin"
      FROM users
      WHERE username = $1`,
      [username]
    )

    const user = res.rows[0]

    if(user) {
      const isValid = await bcrypt.compare(password, user.password)
      if (isValid === true) {
        delete user.password;
        return user
      }
    }
    throw new UnauthorizedError("username/password incorrect")
  }
  
  /** Given a username, return data about the user
   * 
   * Returns {username, password, email, isAdmin, songs}
   * where songs is {id, title}
   * 
   * Throws NotFoundError if user not found
  */
  static async get(username) {
    const userRes = await db.query(`
      SELECT username,
             email,
             is_admin as "isAdmin"
      FROM users
      WHERE username=$1`,
    [username])

    const user = userRes.rows[0]

    if(!user) throw new NotFoundError("User not found.")
      
    const songRes = await db.query(`
      SELECT id, title
      FROM songs
      WHERE username=$1`,
    [username])

    if(songRes.rows[0]) user.songs = songRes.rows

    return user
  }


  /**fetches all users in database
   * 
   * returns [{username, email, isAdmin}, ....]
   */
  static async getAll() {
    const res = await db.query(`SELECT username, email, is_admin as "isAdmin"
    FROM users
    ORDER BY username`);

    return res.rows;
  }

  
  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { password, email, isAdmin }
   *
   * Returns { username, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data={}) {

    if (!Object.keys(data).length) throw new BadRequestError("No fields passed!")

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
    }

    const {setCols, values} = sqlForPartialUpdate(data,
      {
        isAdmin: "is_admin"
      });

      const usernameIdx = `$${values.length + 1}`

      const res = await db.query(`
        UPDATE users
        SET ${setCols}
        WHERE username = ${usernameIdx}
        RETURNING username,
                  email,
                  is_admin AS "isAdmin"
                  `,
        [...values, username]);
        const user = res.rows[0]

        if (!user) throw new NotFoundError("username not found")

        return user
  }

  /**Delete given user from database, returns undefined. */
  static async remove(username) {
    let res = await db.query(
      `DELETE FROM users
       WHERE username=$1
       RETURNING username`,
       [username]
    )

    if (!res.rows[0]) throw new NotFoundError("username not found")
  }
}

module.exports = User