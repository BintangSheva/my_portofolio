function Navbar() {
  return (
    <nav className="navbar flex justify-between items-center py-4 px-8 bg-gray-900 text-white">
      <h2 className="logo text-2xl font-bold">MyPortofolio</h2>
      <ul className="nav-links flex gap-6">
        <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
        <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
        <li><a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a></li>
        <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
