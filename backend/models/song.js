"use strict"

const db = require("../db")
const {NotFoundError, BadRequestError} = require("../expressError")


class Song {
 /**Creates a new song based on informational data and an array of chord names passed
  * 
  * @param data {Object} {title: "New Song", chords: ["str", ...]}
  * 
  * @param username "str" "User1"
  * 
  * returns added song {id, title, username, chords} where chords is : ["A", "E", ...]
  * 
  * Throws not found error if chord is not found, deletes the song entry, as it is now invalid.
 */
    static async addSong(data, username) {
        const userCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`,
        [username])

        if(!userCheck.rows[0]) throw new NotFoundError(`user ${username} not found`)

        const res1 = await db.query(`
        INSERT INTO songs
        (title, username)
        VALUES ($1, $2)
        RETURNING id, title, username`,
        [data.title, username])

        const details = res1.rows[0]
        const chords = data.chords

        for (let chord of chords) {
            try {
                let res = await db.query(`INSERT INTO song_chords
                (song_id, chord_name)
                VALUES ($1, $2)
                RETURNING song_id`,
                [details.id, chord])
            } catch(e) {
                await this.remove(details.id)
                throw new NotFoundError(`${chord} chord not found.`)                
            }
        }

        const song = {...details, chords}
        return song
    }

     /** Get's list of all songs with optional filter by username
      * 
      * Returns list as [{id, title, username}, ...]
      */
    static async getAll(username = null) {
        if(username) {
            const userCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`,
        [username])
            if(!userCheck.rows[0]) throw new NotFoundError(`user ${username} not found`)

            const filterRes = await db.query(`
             SELECT id, title, username
             FROM songs
             WHERE username = $1`, [username])
             return filterRes.rows
        }

        const res = await db.query(`
            SELECT id, title, username
            FROM songs`)
        
        return res.rows
    }

    /**Gets song details, including chord names given song id
     * 
     * returns {id, title, username, chords}
     * where chords is an array of chord names ex: [A, Ab, C, D]
     * 
     * throws not found error if song does not exists
    */
    static async get(id) {
        const res = await db.query(`
            SELECT chord_name as "chordName"
            FROM song_chords
            WHERE song_id = $1`,
        [id])
        if(!res.rows[0]) throw new NotFoundError(`song with id ${id} not found!`)

        const chords = res.rows.map(chord => chord.chordName)

        const res2 = await db.query(`
            SELECT id, title, username
            FROM songs
            WHERE id = $1`,
        [id])

        const songDetails = res2.rows[0]

        const song = {...songDetails, chords}

        return song
    }

     /** Delete given song from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/
    static async remove(id) {
        const res = await db.query(`
                DELETE FROM songs
                WHERE id=$1
                RETURNING id`, [id])
        const song = res.rows[0]

        if(!song) throw new NotFoundError(`Song id: ${id} not found`)
    }

}

module.exports = Song