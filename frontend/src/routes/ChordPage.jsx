import React from "react"
import { Outlet } from "react-router"
import SpellerApi from "../../api"
import NavBar from "../components/NavBar"
import AutoFillBar from "../components/AutoFillBar"
import { useLoaderData } from "react-router"

export async function loader() {
    SpellerApi.token = localStorage.getItem("token")
    const res = await SpellerApi.getAllChords()
    return res
}

const ChordPage = () => {
    const {chords} = useLoaderData()
    return (
        <>
            <NavBar/>
            <AutoFillBar chords={chords.map(chord => chord.name)}/>
            <div id="chord-details"><Outlet/></div>
        </>
    )
}


export default ChordPage