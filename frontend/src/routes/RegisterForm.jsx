import React, {useState} from "react";
import { Form, redirect, useNavigate, useActionData } from "react-router-dom";
import SpellerApi from "../../api";
import {FormGroup, Label, Input, Button} from "reactstrap"
import NavBar from "../components/NavBar";
import "./body.css"

export async function action({request}) {
    try {
        const formData = await request.formData()
        const data = Object.fromEntries(formData)
        const errors = {}
        console.log(data)

        // validate the fields
        if (typeof data.username !== "string" || data.username.length < 4) {
        errors.username =
        "Username must be at least 4 characters";
        };

        if (typeof data.password !== "string" || data.password.length < 5) {
            errors.password = "Password must be at least 5 characters";
        };

        if (typeof data.email !== "string" || !data.email.includes("@")) {
            errors.email =
              "This is not an email address";
          }

        // return data if we have errors
        if (Object.keys(errors).length) {
            return errors;
        };
        const res = await SpellerApi.register(data)
        window.localStorage.setItem("username", data.username)
        window.localStorage.setItem("token", res.token)
        return redirect('/chords') 
    } catch(e) {
        alert(e)
        return redirect('/signup')
    }    
}

const RegisterForm = () => {

    let navigate = useNavigate()
    const errors = useActionData()
    return (
        <>
        <NavBar/>
        <div className="body-container">
            <h1>Register</h1>
            <Form method="post">
                <FormGroup>
                    <Label htmlFor="username">Username:</Label>
                    <Input 
                        type="text" 
                        name="username" 
                        id="username"
                        required
                        />
                    {errors?.username && <span>{errors.username}</span>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Password:</Label>
                    <Input 
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="
                        new-password"
                        required/>
                        {errors?.password && <span>{errors.password}</span>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email">Email:</Label>
                    <Input 
                        type="text"
                        name="email" 
                        id="email"
                        required/>
                        {errors?.email && <span>{errors.email}</span>}
                </FormGroup>
                    <Button type="button" href="/">Cancel</Button>
                    <Button id="register-btn" type="submit">Register</Button>
            </Form>
            </div>
        </>
    )
}

export default RegisterForm