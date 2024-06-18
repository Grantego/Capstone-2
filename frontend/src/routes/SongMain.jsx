import React from "react"
import NavBar from "../components/NavBar"
import SpellerApi from "../../api"
import { Form, Outlet } from "react-router-dom"
import { useLoaderData } from "react-router"
import { Button } from "reactstrap"
import "./songs.css"

export async function loader({params}) {
    let res = await SpellerApi.getUserSongs(params.username)
    return res
}

//NEED TO MAKE A LANDING PAGE TO VIEW THE SONG AS WELL AS AN EDIT PAGE.  EDIT WILL BE DELETE, RESUBMIT.

const SongMain = () => {
 const {songs} = useLoaderData()
    return (
        <>
        <NavBar/>
        <div id="pagediv">
            <div id="sidebar">
            <div>
                <h5><a href={`/${localStorage.getItem("username")}`}>Song Dashboard</a></h5>
                <Button href={`/${localStorage.getItem("username")}/new`}>New</Button>

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