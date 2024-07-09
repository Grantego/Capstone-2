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
                        placeholder="enter username"
                        required/>
                    <Label htmlFor="password">Password:</Label>
                    <Input 
                        type="password"
                        name="password" 
                        id="password"
                        autoComplete="current-password"
                        placeholder="enter password"
                        required/>
                </FormGroup>
                    <Button type="button" href="/">Cancel</Button>
                    <Button id="login-btn" type="submit">Login</Button>
            </Form>
            </div>
        </>
    )
}

export default LoginForm