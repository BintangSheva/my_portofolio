import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [active, setActive] = useState("Home");
  const menus = ["Home", "Projects", "About", "Contact"];

  return (
    <div className="flex justify-center items-center w-full py-6 bg-gray-100">
      <nav className="bg-white shadow-xl rounded-full px-8 py-3 flex space-x-8 items-center backdrop-blur-md border border-gray-200">
        {menus.map((menu) => (
          <a
            key={menu}
            href={`#${menu.toLowerCase()}`}
            onClick={() => setActive(menu)}
            className={`nav-item relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
              active === menu
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md"
                : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
          >
            {menu}
            {active === menu && (
              <span className="active-indicator"></span>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;
