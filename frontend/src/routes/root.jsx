import NavBar from "../components/NavBar"
import "./Root.css"

const Root = () => {
    return (
        <>
        <NavBar/>
        <div className="container-div">
            {localStorage.getItem('token') ?
            <h1>{`Welcome back, ${localStorage.getItem('username')}`}</h1> :
            <h1>Chord Assistant</h1>}
        </div>

        </>
    )
}

export default Root

