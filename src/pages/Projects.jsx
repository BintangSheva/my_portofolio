import { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Coming Soon 🚀",
    description: "Your awesome projects will appear here soon!",
    image: "https://via.placeholder.com/400x250?text=Project+Coming+Soon",
  },
  {
    title: "FinMate",
    description: "A smart financial that recommends optimal salary allocation using Machine Learning.",
    image: "https://via.placeholder.com/400x250?text=FinMate",
    link: "/finmate", // nanti ini di pake buat buka detail apa itu FinMate
  },
  {
    title: "Future Project 💡",
    description: "Stay tuned for the next big thing!",
    image: "https://via.placeholder.com/400x250?text=Future+Project",
  },
];

function Projects() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () =>
    setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  const openProject = () => {
    const currentProject = projects[current];
    if (currentProject.link) {
      window.open(currentProject.link, " _blank"); 
    }
  }

  return (
    <section id="projects" className="bg-gray-900 text-white py-20 px-6 text-center relative overflow-hidden">
      <h2 className="text-4xl font-bold mb-8 text-blue-400">✨ My Projects ✨</h2>

      <div className="flex justify-center items-center relative">
        <button
          onClick={prevSlide}
          className="absolute left-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full text-white"
        >
          ‹
        </button>

        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-[90%] sm:w-[400px] md:w-[500px] bg-gray-800 rounded-2xl shadow-lg p-4"
          onClick={openProject} // nambahin ini 
        >
          <img
            src={projects[current].image}
            alt={projects[current].title}
            className="rounded-xl mb-4"
          />
          <h3 className="text-2xl font-semibold">{projects[current].title}</h3>
          <p className="text-gray-400 mt-2">{projects[current].description}</p>
        </motion.div>

        <button
          onClick={nextSlide}
          className="absolute right-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full text-white"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Projects;
