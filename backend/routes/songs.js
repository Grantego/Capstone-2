"use strict"

/** Routes for chords */

const jsonschema = require("jsonschema")

const express = require("express")
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Song = require('../models/song')
const newSongSchema = require('../schemas/songNew.json');
const songSearchSchema = require('../schemas/songSearch.json')

const router = express.Router({ mergeParams: true });

/** POST /:username {title: str, chords: [arr]} => {song} 
 * 
 * Creates new song with the title and chords provided (format above).
 * 
 * Returns {song: {id: 1, title: "New Song", username: "user", chords: ["A", "E", "A", ...]}}
 * 
 * Auth required: admin or same as submitted username
*/
router.post("/:username", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newSongSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const song = await Song.addSong(req.body, req.params.username)
        return res.json({song})
    } catch(e) {
        next(e)
    }
})

/** GET / =>
 *   { songs: [ { id, title, username}, ...] }
 *
 * Can provide search filter by username
 * 
 * Authorization required: logged in
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    const q = req.query.username
    try {
        const validator = jsonschema.validate(req.query, songSearchSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
    const songs = await Song.getAll(q)
    return res.json({songs})
    } catch(e) {
        return next(e)
    }
})
/** GET /:id => {song}
 * 
 * Gets song details for provided song id
 * 
 * Returns {song: {id: 1, title: "New Song", username: "user", chords: ["A", "E", "A", ...]}}
 * 
 * Auth required: logged-in
 */

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const song = await Song.get(req.params.id)
        return res.json({song})
    }catch(e) {
        next(e)
    }
})



/** DELETE /:id => {deleted: id } 
 * 
 * Deletes song entry in database.
 * 
 * Auth required: admin
*/


// CANNOT ALLOW PUBLIC ACCESS TO API WITH THIS AUTH METHOD. Cannot guarantee that users are properly logged in for a delete. 
router.delete("/:id", ensureLoggedIn, async function(req,res, next) {
    try {
        await Song.remove(req.params.id)
        return res.json({deleted: +req.params.id})
    } catch(e) {
        next(e)
    }
})

module.exports = router