function Navbar() {
    const username = localStorage.getItem("username");

    return (
        <div
            className="
                bg-blue-600
                text-white
                p-4
                shadow
            "
        >
            <h1 className="text-2xl font-bold">Hospital Management System</h1>

            <p>Welcome, {username}</p>
        </div>
    );
}

export default Navbar;
