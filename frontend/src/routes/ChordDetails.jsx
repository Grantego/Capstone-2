import React from "react";
import { useLoaderData } from "react-router";
import SpellerApi from "../../api";

export async function loader({params}) {
  let res = await SpellerApi.getChord(params.name)
  console.log(res)
  return res
}

const ChordDetails = () => {
  const chord = useLoaderData()
  console.log(chord)
    return (
        <>
        <h1>{chord.name}</h1>
        <h2>Spelling: {chord.spelling}</h2>
        <img src={chord.chordChart} alt={`${chord.name} Chord Chart`} />
        </>
    )
}

export default ChordDetails