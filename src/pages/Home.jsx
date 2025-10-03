import React from "react";
import "../pages/Home.css"; // pastikan path-nya bener, bisa ubah kalau folder css lo beda
import bgImage from "../assets/kimdami.jpg";

export default function Home() {
  return (
    <section
      id="home"
      className="home"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay" />
      <div className="content fade-up">
        <h1>Bintang</h1>
        <p>
          I’m an Informatics Engineering student passionate about crafting clean,
          modern web experiences and uncovering powerful insights from data.
        </p>
        <a href="#projects" className="btn">View My Projects</a>
      </div>
    </section>
  );
}
