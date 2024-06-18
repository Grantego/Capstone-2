"use strict";

const db = require('../db')
const { BadRequestError, NotFoundError} = require("../expressError")
const {sqlForPartialUpdate} = require("../helpers/sql")

// Functions for chords table

class Chord {
    /** Create a new chord, update db, return new chord data
     * 
     * throws BadRequestError if the given chord name already exists
     * 
     * takes {name, spelling, chordChart}
     * 
     * returns the new chord
     */

    static async create({name, spelling, chordChart}) {
        const duplicateCheck = await db.query(
            `SELECT name
             FROM chords
             WHERE name= $1`,
             [name]
        )

        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`${name} chord already exists!`)
        }

        const res = await db.query(
            `INSERT INTO chords
            (name, spelling, chord_chart)
            VALUES ($1, $2, $3)
            RETURNING name, spelling, chord_chart AS "chordChart"`,
            [name, spelling, chordChart]
        )

        return res.rows[0]
    }

    /** Returns list of all chords in database */
    static async getAll() {
        const res = await db.query(`SELECT name, spelling, chord_chart as "chordChart" FROM chords`)

        return res.rows
    }

    /** Given a chord name, return full data on chord.
     * 
     * returns {name, spelling, chordChart}
     * 
     * Throws NotFoundError if not found.
     */
    static async get(name) {
        const res = await db.query(
            `SELECT name,
                    spelling,
                    chord_chart as "chordChart"
            FROM chords
            WHERE name=$1`,
            [name]
        )

        const chord = res.rows[0]
        if(!chord) throw new NotFoundError(`${name} chord not found!`)

        return chord
    }

  /** Update chord data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {spelling, chordChart }
   *
   * Returns {name, spelling, chordChart}
   *
   * Throws NotFoundError if not found.
   */
    static async update(name, data) {
        if(!data || !Object.keys(data).length) throw new BadRequestError("No update fields provided")
        const {setCols, values} = sqlForPartialUpdate(data,
            {
                chordChart: "chord_chart"
            }
        )
        const nameIdx = `$${values.length + 1}`

        const res = await db.query(
            `UPDATE chords
            SET ${setCols}
            WHERE name = ${nameIdx}
            RETURNING name,
                      spelling,
                      chord_chart as "chordChart"`,
                      [...values, name]
        )

        const chord = res.rows[0]

        if(!chord) throw new NotFoundError(`${name} chord not found!`)

        return chord
    }

    /**Removes entry for given chord name in database
     * 
     * throws NotFoundError if chord not found
     * 
     * returns undefined
     */

    static async remove(name) {
        const res = await db.query(`DELETE FROM chords
                    WHERE name = $1
                    RETURNING name`,
                    [name])
        
        const chord = res.rows[0]

        if(!chord) throw new NotFoundError(`${name} chord not found!`)
    }
}

module.exports = Chord