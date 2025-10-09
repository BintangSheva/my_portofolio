import { Mail, Github, Instagram, Linkedin } from "lucide-react";

function Contact () {
    return (
        <section id="contact" className="bg-gray-900 text-white py-20 px-8 text-center">
            <h2 className="text-4xl font-bold mb-4"> Let's Connect </h2>
            <p className="text-gray-300 mb-8 text-lg">
                Got a project or just  wanna say Hi!!! Fell free to reach me out!
            </p>

            <div className="flex justify-center gap-8 text-3xl">
                <a href="mailto:abinbintang133@gmail.com" className="hover:text-blue-400 transition-colors">
                    <Mail/>
                    </a>
                    <a href="https://github.com/BintangSheva/my_portofolio" target="_blank" className="hover:text-gray-400 transition-colors">
                    <Github/>
                    </a>
                    <a href="https://www.instagram.com/abintng__/" target="_blank" className="hover:text-pink-500 transition-colors">
                    <Instagram/>
                    </a>
                    <a href="https://www.linkedin.com/in/abin-bintang-181aa5247/" target="_blank" className="hover:text-blue-500 transition-colors">
                    <Linkedin/>
                    </a>
            </div>
        </section>
    );
}

export default Contact;