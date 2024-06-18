"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Auth required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema)
        console.log(validator)
        if(!validator.valid) {
            console.log("running...")
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const user = await User.register(req.body)
        const token = createToken(user)
        return res.status(201).json({user, token})
    } catch(e) {
        next(e)
    }
})

/** GET / => { users: [ { username, email, isAdmin }, ... ]}
 * 
 * Auth required: admin
 */
router.get("/", ensureAdmin, async function(req, res, next) {
    try {
        const users = await User.getAll()
        return res.json({users})        
    } catch(e) {
        next(e)
    }
})

/** GET /[username] => {user: { username, email, isAdmin, (if exists) songs: {id, title} } }
 * 
 * Auth required: admin or same user as passed username
*/
router.get("/:username", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const user = await User.get(req.params.username)
        return res.json({user})
    } catch(e) {
        next(e)
    }
})

/**PATCH /[username] => {user: {username, email, isAdmin}}
 * 
 * Data can include: {email, password}
 * 
 * Auth required: admin or same user as passed username
*/
router.patch("/:username", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.update(req.params.username, req.body);
        return res.json({user});
    } catch(e) {
        next(e);
    }
})

/** DELETE /[username]  =>  { deleted: username }
 *
 * Auth required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function(req, res, next){
    try {
        await User.remove(req.params.username)
        return res.json({deleted: req.params.username})
    }catch (e) {
        next(e)
    }
})

module.exports = router;