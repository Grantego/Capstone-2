import React from "react";
import { useLoaderData } from "react-router";
import SpellerApi from "../../api";
import "./ChordDetails.css"

export async function loader({params}) {
  let res = await SpellerApi.getChord(encodeURIComponent(params.name))
  return res
}

const ChordDetails = () => {
  const {chord} = useLoaderData()
    return (
        <>
        <h1 id="chord-detail-name">{chord.name}</h1>
        <h2 id="chord-detail-spelling">Spelling: {chord.spelling}</h2>
        <div id="chord-chart-box">
        <img id="chord-detail-img" src={chord.chordChart} alt={`${chord.name} Chord Chart`} />
        </div>

        </>
    )
}

export default ChordDetails