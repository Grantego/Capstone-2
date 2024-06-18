import NavBar from "../components/NavBar"

const Root = () => {
    return (
        <>
        <NavBar/>
        {localStorage.getItem('token') ?
        <h1>{`Welcome back, ${localStorage.getItem('username')}`}</h1> :
        <h1>Chord Assistant</h1>}
        </>
    )
}

export default Root