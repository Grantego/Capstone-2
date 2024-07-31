import React from "react";
import SpellerApi from "../../api";
import { useLoaderData, redirect } from "react-router";
import { Form } from "react-router-dom";
import { Button } from "reactstrap";
import "./songDetail.css"


export async function action({request}) {
  let formData = await request.formData()
  let song = formData.get("song")
  await SpellerApi.deleteSong(song)
  return redirect(`/${localStorage.getItem("username")}`)
}
export async function loader({params}) {
    const res = await SpellerApi.getSongDetails(params.id)
    res.song.chords = await Promise.all(res.song.chords.map(async c => {
        const {chord} = await SpellerApi.getChord(c)
        return chord
    }))
    return res
}

const SongDetail = () => {
    const {song} = useLoaderData()
    console.log(song)
    return (
        <>
         <h1>{song.title}</h1>
         <h3>By {song.username}</h3>
         <Form method="post">
            <Button type="submit" name="song" value={song.id}>Delete</Button>
         </Form>
         <div className="chord-list">
            {song.chords.map((chord, i) => (
            <div key={`${i}${chord.name}`}className="chord">
                {chord.name}
                <div className="chord-chart">
                    <img src={chord.chordChart} alt={`${chord.name} chart`} />
                </div>
            </div>                
            ))}
         </div>
        </>
    )
}


export default SongDetail