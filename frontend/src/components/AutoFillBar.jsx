import React, {useState} from "react"
import { Form, redirect, useSubmit } from "react-router-dom"
import { filterSearch } from "../helpers/helpers"
import {InputGroup, Input, Button, ListGroup, ListGroupItem } from "reactstrap"

export async function action({request}) {
    document.querySelector("#name").value = "";
    let formData = await request.formData()
    const name = formData.get("name")
    return redirect(`/chords/${encodeURIComponent(name)}`)
  }

const AutoFillBar = ({chords}) => {

    const [autofillChords, setAutofillChords] = useState([])
    const [inputValue, setInputValue] = useState("")
    const submit = useSubmit()


    const handleChange = (e) => {
        const {value} = e.target
        setInputValue(value)
        const filtered = filterSearch(value, chords)
        setAutofillChords(filtered)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        submit(e.target, { replace: true }) // Trigger form submission
        console.log('running')
        setInputValue("") // Reset the input value
        setAutofillChords([])
    }
    return (
        <>
            <Form method="post" onSubmit={handleSubmit}>
                <InputGroup>
                    <Input type="text"
                           placeholder="chord name ex: C, Cm, Cmaj7"
                           aria-label="chord-input"
                           name="name"
                           id="name"
                           value={inputValue}
                           onChange={handleChange}/>
                    <Button type="submit">Search</Button>
                </InputGroup>
            </Form>
            <ListGroup id="autofill-results">
                {autofillChords.length !== chords.length && autofillChords.map(chord => (
                <ListGroupItem action href={`/chords/${encodeURIComponent(chord)}`} aria-label={chord} tag="a" key={chord}>
                    {chord}
                </ListGroupItem>
                ))}
            </ListGroup>
        </>
    )
}

export default AutoFillBar