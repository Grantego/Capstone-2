"use strict"

/** Routes for chords */

const jsonschema = require("jsonschema")

const express = require("express")
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Chord = require('../models/chord')
const newChordSchema = require('../schemas/chordNew.json');
const updateChordSchema = require('../schemas/chordUpdate.json')

const router = express.Router({ mergeParams: true });

/** POST / {chord} => {chord} 
 * 
 * Adds new chord. Chord must be:
 * 
 * {name, spelling, chordChart} chordChart should be a url to an image of the guitar chord chart.
 * 
 * Returns same
 * 
 * Auth required: admin
*/

router.post("/", ensureAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newChordSchema)
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        let newChord = req.body

        const chord = await Chord.create(newChord)
        return res.status(201).json({chord})

    } catch(e) {
        next(e)
    }
})


/** GET /  => {chords: [chord, ...]}
 * 
 * Retrieves list of all chords, where chord is:
 * {name, spelling, chordChart}
 * 
 * Auth required: user
*/
router.get("/", ensureLoggedIn, async function(req,res,next) {
    try {
        const chords = await Chord.getAll()
        return res.json({chords})
    } catch(e) {
        next(e)
    }
})

/** GET /[name] => {chord} 
 * 
 * Retrieves info on specific chord
 * 
 * Returns {chord: {name, spelling, chordChart}}
 * 
 * Auth required: user
*/
router.get("/:name", ensureLoggedIn, async function(req,res,next) {
    try {  
        const chord = await Chord.get(req.params.name)
        return res.json({chord})
    } catch(e) {
        next(e)
    }
})

/** PATCH /[name] {spelling, chordChart} => {chord} 
 * 
 * Accepts optional paramaters of either spelling or chord chart.
 * 
 * Returns {chord: {name, spelling, chordChart}}
 * 
 * Auth required: admin
*/
router.patch("/:name", ensureAdmin, async function(req,res,next) {
    try {
        const validator = jsonschema.validate(req.body, updateChordSchema)
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const chord = await Chord.update(req.params.name ,req.body)
        return res.json({chord})
    }catch(e) {
        next(e)
    }
})

/** DELETE /[name] => {deleted: name}
 * 
 * Deletes chord from database
 * 
 * Auth required: admin
*/

router.delete("/:name", ensureAdmin, async function(req,res,next) {
    try {
        await Chord.remove(req.params.name)
        return res.json({ deleted: req.params.name})
    } catch(e) {
        next(e)
    }
})

module.exports = router