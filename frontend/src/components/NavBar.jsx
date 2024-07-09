import React, {useState} from "react";
import "./NavBar.css"
import {NavLink} from 'react-router-dom'
import SpellerApi from "../../api";
import {Navbar, Nav, NavItem, NavbarBrand, Collapse, NavbarToggler} from "reactstrap"


const NavBar = () => {
    let token = localStorage.getItem("token")
    const [collapsed, setCollapsed] = useState(true)

    const toggleNavbar = () => setCollapsed(!collapsed)
    const logout = () => {
        SpellerApi.logout()
    }

    if (token) {
        return (
            <> 
            <Navbar id="navbar" color="faded" light>
            <NavbarBrand href="/" className="me-auto">
                Chord Helper
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} className="me-2" />
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink to={`/${localStorage.getItem("username")}`}>Songs</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/chords">Chords</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/login" onClick={logout}>Logout</NavLink>
                    </NavItem>

                </Nav>
            </Collapse>
            </Navbar>
            </>
        )
    } else {
        return (
            <>
            <Navbar color="faded" light>
                <NavbarBrand href="/" className="me-auto">
                    Chord Helper
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="me-2" />
                <Collapse isOpen={!collapsed}>                
                <Nav navbar>
                    <NavItem>
                        <NavLink to="/signup">Sign Up</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/login">Login</NavLink>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
            </>
        )  
    }
}

export default NavBar