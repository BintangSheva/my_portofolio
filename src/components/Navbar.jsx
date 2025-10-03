function Navbar() {
    return(
        <nav className="navbar">
           <h2 className="logo">MyPortofolio</h2>
           <ul className="nav-links">
            <li><a href="home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="project">Projects</a></li>
            <li><a href="contact">Contact</a></li>
           </ul>
        </nav>
    );
}

export default Navbar;