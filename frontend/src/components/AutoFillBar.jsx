import React, {useState} from "react"
import { Form, redirect } from "react-router-dom"
import { filterSearch } from "../helpers/helpers"
import {InputGroup, Input, Button, ListGroup, ListGroupItem } from "reactstrap"

export async function action({request}) {
    console.log("running")
    let formData = await request.formData()
    const name = formData.get("name")
    console.log(name)
    return redirect(`${name}`)
  }

const AutoFillBar = ({chords}) => {

    const [autofillChords, setAutofillChords] = useState([])

    const handleChange = (e) => {
        const {value} = e.target
        const filtered = filterSearch(value, chords)
        setAutofillChords(filtered)
        console.log(autofillChords)
    }
    return (
        <>
            <Form method="post">
                <InputGroup>
                    <Input type="text"
                           placeholder="chord name ex: C, Cm, Cmaj7"
                           name="name"
                           id="name"
                           onChange={handleChange}/>
                    <Button>Search</Button>
                </InputGroup>
            </Form>
            <ListGroup>
                {autofillChords.length !== chords.length && autofillChords.map(chord => (
                <ListGroupItem action href={`/chords/${chord}`} tag="a" key={chord}>
                    {chord}
                </ListGroupItem>
                ))}
            </ListGroup>
        </>
    )
}

export default AutoFillBar