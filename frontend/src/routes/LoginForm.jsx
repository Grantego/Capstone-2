import React from "react";
import { Form, redirect, useNavigate, useActionData } from "react-router-dom";
import SpellerApi from "../../api";
import { FormGroup, Label, Input, Button } from "reactstrap";
import NavBar from "../components/NavBar";
import "./body.css"


export async function action({request}) {
    const errors = {};
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const res = await SpellerApi.login(data);
        console.log(res)
        SpellerApi.token = res.token
        window.localStorage.setItem("username", data.username);
        window.localStorage.setItem("token", res.token);
        return redirect("/chords");
    } catch(e) {
        errors.unauthorized = "Username / Password incorrect!"
        return errors;
    }

}

const LoginForm = () => { 
    const errors = useActionData()

    let navigate = useNavigate()

    return (
        <>
            <NavBar/>
            <div className="body-container">
            <h1>Login</h1>
            {errors?.unauthorized && <span>{errors.unauthorized}</span>}
            <Form method="post">
                <FormGroup>
                    <Label htmlFor="username">Username:</Label>
                    <Input 
                        type="text"
                        name="username" 
                        id="username"
                        autoComplete="username"
                        required/>
                    <Label htmlFor="password">Password:</Label>
                    <Input 
                        type="password"
                        name="password" 
                        id="password"
                        autoComplete="current-password"
                        required/>
                </FormGroup>
                    <Button type="button" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit">Login</Button>
            </Form>
            </div>
        </>
    )
}

export default LoginForm