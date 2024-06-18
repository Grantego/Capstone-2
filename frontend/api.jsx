import axios from "axios";

const BASE_URL =  "http://localhost:3001";

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

  static async getChord(name) {
    let res = await this.request(`chords/${name}`);
    return res.chord;
  }

  //returns list of all chords in an array, with each as objects
  static async getAllChords() {
    let res = await this.request('chords')
    return res.chords
  }
  // Handles login

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
  static async register(data) {
    let res = await this.request(`auth/register`, data, "POST")
    return res
  }
  
  // gets a list of all songs by a specific user
  static async getUserSongs(username) {
    let res = await this.request(`songs?username=${username}`)
    return res
  }

  static async addSong(data, username) {
    let res = await this.request(`songs/${username}`, data, "POST")
    return res
  }

  static async getSongDetails(id) {
    let res = await this.request(`songs/${id}`)
    return res
  }

  static async deleteSong(id) {
    console.log(SpellerApi.token)
    let res = await this.request(`songs/${id}`, {}, 'delete')
    return res
  }
}
SpellerApi.token = window.localStorage.getItem("token") || ""


    export default SpellerApi