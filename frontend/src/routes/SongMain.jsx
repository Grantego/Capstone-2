import React from "react"
import NavBar from "../components/NavBar"
import SpellerApi from "../../api"
import { Form, Outlet, NavLink } from "react-router-dom"
import { useLoaderData } from "react-router"
import { Button } from "reactstrap"
import "./SongMain.css"

export async function loader({params}) {
    if (localStorage.getItem('username') !== params.username) throw new Error("not authorized to view this page")
    let res = await SpellerApi.getUserSongs(params.username)
    return res
}

const SongMain = () => {
 const {songs} = useLoaderData()
    return (
        <>
        <NavBar/>
        <div id="pagediv">
            <div id="sidebar">
            <div>
                <h5><a id="song-header" href={`/${localStorage.getItem("username")}`}>My Songs</a></h5>
                <Button id="new-song-btn" href={`/${localStorage.getItem("username")}/new`}>New</Button>

            </div>
            <nav>
                <ul>
                    {songs.length ? songs.map((song) => (
                        <li key={song.id}>
                            <a href={`/${localStorage.getItem("username")}/${song.id}`}>{song.title}</a>
                        </li>
                    )) : <li>No songs found</li>}
                </ul>
            </nav>
            </div>
            <div id="detail"><Outlet/></div>
        </div>
      </>
  
    )
}

export default SongMain