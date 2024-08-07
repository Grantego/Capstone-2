import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

/** API Class.
 *
 */

class SpellerApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    // adds token to auth header
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${SpellerApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a chord by name. */
  // returns  {chord : {name, spelling, chordChart}}
  static async getChord(name) {
    let res = await this.request(`chords/${name}`);
    return res;
  }

  // list of all chords in an array, with each as objects
  //returns {chords : [{name, spelling, chordChart}]}
  static async getAllChords() {
    let res = await this.request('chords')
    return res
  }
  // Handles login
  // returns token
  static async login(data) {
    let res = await this.request('auth/token', data, "POST");
    return res
  }

  // Handles logout
  static async logout() {
    SpellerApi.token = ""
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  // Registers new user. Data is taken in as an object of form data fields
  // returns token
  static async register(data) {
    let res = await this.request(`auth/register`, data, "POST")
    return res
  }
  
  // gets a list of all songs by a specific user
  // { songs: [ { id, title, username}, ...] }
  static async getUserSongs(username) {
    let res = await this.request(`songs?username=${username}`)
    return res
  }
// adds new song
// Returns {song: {id: 1, title: "New Song", username: "user", chords: ["A", "E", "A", ...]}}
  static async addSong(data, username) {
    let res = await this.request(`songs/${username}`, data, "POST")
    return res
  }
// gets details on a specific song
// Returns {song: {id: 1, title: "New Song", username: "user", chords: ["A", "E", "A", ...]}}
  static async getSongDetails(id) {
    let res = await this.request(`songs/${id}`)
    return res
  }
 // deletes song
  static async deleteSong(id) {
    let res = await this.request(`songs/${id}`, {}, 'delete')
    return res
  }
}
SpellerApi.token = window.localStorage.getItem("token") || ""


    export default SpellerApi