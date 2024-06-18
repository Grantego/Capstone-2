const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testSongIds = [];

async function commonBeforeAll() {
    await db.query("DELETE FROM users")
    await db.query("DELETE FROM chords")
    await db.query("DELETE FROM songs")

    await db.query(`
        INSERT INTO chords (name, spelling, chord_chart)
        VALUES ('C', 'C,E,G', 'test.com'),
                ('F', 'F,A,C', 'test2.com'),
                ('G', 'G,B,D', 'test3.com')`)

    await db.query(`
    INSERT INTO users (username, password, email, is_admin)
    VALUES ('testadmin', $1, 'test@test.com', true),
           ('testuser', $2, 'test2@test.com', false)
           RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
        ])
    
   const resultsSongs = await db.query(
        `INSERT INTO songs (title, username)
         VALUES ('test song', 'testuser'),
                ('test song2', 'testadmin')
         RETURNING id`
    )
    testSongIds.splice(0, 0, ...resultsSongs.rows.map(r => r.id));

    await db.query(`
        INSERT INTO song_chords (song_id, chord_name)
        VALUES ($1, 'C'),
               ($1, 'F'),
               ($1, 'C'),
               ($1, 'G'),
               ($2, 'C'),
               ($2, 'C'),
               ($2, 'F'),
               ($2, 'G')
        `, [testSongIds[0], testSongIds[1]])
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
  
  
  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testSongIds,
  };