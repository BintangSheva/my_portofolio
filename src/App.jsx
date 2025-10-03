import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import komponen navbar
import Navbar from './components/Navbar'
// import komponen home
import Home from './pages/Home'

// import komponen Hello
import Hello from './components/Hello'

// import komponen About
import About from './pages/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <Home />
    <Hello />
    <About/>
    </>
  );
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
  
      <main>
        <section id="home"> Ini Home </section>
        <section id="about"> Ini About</section>
        <section id="projects"> Ini Projects</section>
        <section id="contact"> Ini Contact</section>
      </main>
      <h1>Halo der</h1>
      {/*  👇 Panggil komponen Hello */}
    
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
           {count === 0 ? "klik aku dong 👆 " : 'udh diklik'}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        ini project pertama gua let,s focking gooo 
      </p>
    </>
  
}

export default App
