function Navbar() {

    const username =
        localStorage.getItem("username");

    return (

        <div>

            <h2>
                Hospital Management System
            </h2>

            <p>
                Welcome, {username}
            </p>

            <hr />

        </div>
    );
}

export default Navbar;