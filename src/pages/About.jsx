// src/pages/About.jsx
import React from "react";
import "./About.css"; //kita bakal bikin ini habis ini
import profilePic from "../assets/fikri.jpg"
import profilePic1 from "../assets/cahyo.jpg"
import profilePic2 from "../assets/ali.jpg"
import profilePic3 from "../assets/Bintang.jpg"
import profilePic4 from "../assets/Zaky.jpg"
import profilePic5 from "../assets/suhenda.jpg"
import profilePic6 from "../assets/rakha.jpg"

function About() {
    return (
        <section className="about" id="about">
            <h2>M Fikri Arrayan👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                    <p>
                        <strong> M Fikri Arrayan (23040700043) </strong> saya Fikri mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                    </p>
                    <p>
                        Email :FikriArr761@gmail.com
                    </p>
                    <p>
                        Nomor : 0875347287622
                    </p>
                    <p>
                        TTL : Blitar, 14 Desember 2004
                    </p>
                </div>
            </div>
             <h2> Hafizh Cahyo Priadipto👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic1}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                     <strong> Hafizh Cahyo Priadipto(23040700045) </strong> saya Dipto mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                       <p>
                        Email :Cahyodipto@gmail.com
                    </p>
                    <p>
                        Nomor : 082276184671
                    </p>
                    <p>
                        TTL : Bengkulu, 10 Januari 2005
                    </p>
                </div>
            </div>
            <h2>Luqman Ali Dinul Ramadhan 👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic2}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                     <strong> Luqman Ali Dinul Ramadhan (23040700050) </strong> saya Dinul mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                      <p>
                        Email : Alikualimu@gmail.com
                    </p>
                    <p>
                        Nomor : 082177220019
                    </p>
                    <p>
                        TTL : Palembang, 27 Agustus 2004
                    </p>
                </div>
            </div>
            <h2>Bintang Sheva  👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic3}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                     <strong> Bintang Sheva (23040700055) </strong> saya Bintang mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                       <p>
                        Email : abinbintang123@gmail.com
                    </p>
                    <p>
                        Nomor : 081314259912
                    </p>
                    <p>
                        TTL : Melbourne, 8 Februari 2004
                    </p>
                </div>
            </div>
            <h2>Zaky Pratama  👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic4}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                </div>
                 <strong> Zaky Pratama(23040700069) </strong> saya Zaky mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                   <p>
                        Email : zaky.pratama5561@gmail.com
                    </p>
                    <p>
                        Nomor :  085384550100
                    </p>
                    <p>
                        TTL : Bengkulu, 22 Februari 2005
                    </p>
            </div>
            <h2>Achmad Suhendar 👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic5}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                     <strong> Achmad Suhendar (23040700099) </strong> saya Suhendar mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                       <p>
                        Email : Suhendarac@gmail.com
                    </p>
                    <p>
                        Nomor : 081200560921
                    </p>
                    <p>
                        TTL : Jakarta, 21 Juni 2004
                    </p>
                </div>
            </div>
            <h2>Rakha Artyan Qais  👨‍💻 </h2>
            <div className="about-content">
                <img
                src={profilePic6}
                alt="Bintang Sheva"
                className="Profile-pic"
                />
                <div className="about-text">
                     <strong> Rakha Artyan Qais (23040700111) </strong> saya Qais mahasiswa teknik informatika yang berkuliah di Univeristas Muhammadiyah Jakarta
                       <p>
                        Email : Rakhabumingraka@gmail.com
                    </p>
                    <p>
                        Nomor : 082166720190
                    </p>
                    <p>
                        TTL : Seoul, 3 September 2004
                    </p>
                </div>
            </div>
            <h3 className="schedule-title">📅 My Class Schedule</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Course</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>Web Programming</td>
                <td>08:00 - 10:00</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>Database Systems</td>
                <td>10:00 - 12:00</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>Data Structures</td>
                <td>13:00 - 15:00</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>Software Engineering</td>
                <td>09:00 - 11:00</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>Artificial Intelligence</td>
                <td>08:00 - 10:00</td>
              </tr>
            </tbody>
          </table>
        </section>
    )
}

export default About;