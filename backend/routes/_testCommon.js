"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Song = require("../models/song");
const Chord = require("../models/chord");
const { createToken } = require("../helpers/tokens");

const testSongIds = [];
let adminSongChords
let userSongChords
async function commonBeforeAll() {
    await db.query("DELETE FROM users")
    await db.query("DELETE FROM songs")
    await db.query("DELETE FROM chords")

    await Chord.create({
        name: "C",
        spelling: "C,E,G",
        chordChart: "testurl"
    })
    await Chord.create({
        name: "F",
        spelling: "F,A,C",
        chordChart: "testurl"
    })
    await Chord.create({
        name: "G",
        spelling: "G,B,D",
        chordChart: "testurl"
    })

    await User.register({
        username: "testadmin",
        password: "testpass",
        email: "test@test.com",
        isAdmin: true
    })
    await User.register({
        username: "testuser",
        password: "testpass",
        email: "test2@test.com",
        isAdmin: false
    })

    testSongIds[0] = (await Song.addSong({ title: "Test Song", chords: ["C","F","G"]}, "testadmin")).id
    testSongIds[1] = (await Song.addSong({ title: "Test Song 2", chords: ["G","F","C"]}, "testuser")).id
  }
  
  async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
  
  const u1Token = createToken({ username: "testuser", isAdmin: false });
  const adminToken = createToken({ username: "testadmin", isAdmin: true });
  
  
  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testSongIds,
    u1Token,
    adminToken,
    adminSongChords,
    userSongChords
  };
  