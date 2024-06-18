import React, {useState} from "react"
import { Form, redirect, useLoaderData } from "react-router-dom"
import { filterSearch } from "../helpers/helpers"
import {InputGroup, Input, Button, ListGroup, ListGroupItem } from "reactstrap"
import SpellerApi from "../../api"


export async function action({request}) {
    console.log("running")
    let formData = await request.formData()
    const title = formData.get("title")
    const newChords = JSON.parse(formData.get("newChords"));
    console.log(newChords)
    const data = {
        title: title,
        chords: newChords
    }
    const username = window.localStorage.getItem('username')
    const {song} = await SpellerApi.addSong(data, username)
    return redirect(`/${username}/${song.id}`)
}

const NewSong = () => {
    const chords = useLoaderData()
    const chordNames = chords.map(chord => chord.name)
    const [newChords, setNewChords] = useState([])
    const [autofillChords, setAutofillChords] = useState([])

    const handleChange = (e) => {
        const {value} = e.target
        const filtered = filterSearch(value, chordNames)
        setAutofillChords(filtered)
    }

    const handleAddChord = () => {
        const nameInput = document.getElementById("name")
        const newVal = nameInput.value
        if (!chordNames.includes(newVal)) {
            alert("Unknown chord!")
            return
        }
        setNewChords(chords => [...chords, newVal])
        nameInput.value = ""
        setAutofillChords([])
    }
    const handleClick = (e) => {
        const nameInput = document.getElementById("name")
        const newVal = e.currentTarget.getAttribute("data-value");
        if (!chordNames.includes(newVal)) {
            alert("Unknown chord!")
            return
        }
        setNewChords(chords => [...chords, newVal])
        console.log(newChords)
        nameInput.value = ""
        setAutofillChords([])
    }
    return (
        <>
            <Form method="post">
                    <InputGroup>
                        <Input type="text"
                           placeholder="Title"
                           name="title"
                           id="title"/>
                    </InputGroup>
                    <InputGroup>
                    <Input type="text"
                           placeholder="chord name ex: C, Cm, Cmaj7"
                           name="name"
                           id="name"
                           onChange={handleChange}/>
                    <Button type="button" onClick={handleAddChord}>add chord</Button>
                </InputGroup>
                <Input type="hidden"
                       name="newChords"
                       value={JSON.stringify(newChords)} />
                    <ListGroup>
                        {autofillChords.length !== chords.length && autofillChords.map((chord, i) => (
                        <ListGroupItem action 
                            onClick={handleClick}
                            key={`${chord}${i}`}
                            data-value={chord}
                            >
                            {chord}
                        </ListGroupItem>
                        ))}
                    </ListGroup>
                <Button type="submit">Submit</Button>
            </Form>
            {newChords.map((chord, i) => <h3 key={`${chord}chord${i}`}>{chord}</h3>)}
        </>
    )
}

export default NewSong