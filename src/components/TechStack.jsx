import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const techStack = [
  {
    category: "Frontend",
    technologies: [
      { name: "React", icon: "/reactjs.svg" },
      { name: "Next.js", icon: "/nextjs.png" },
      { name: "HTML5", icon: "/html.svg" },
      { name: "CSS3", icon: "/css.svg" },
      { name: "JavaScript", icon: "/javascript.svg" },
      { name: "Tailwind CSS", icon: "/tailwind.svg" },
      { name: "Material UI", icon: "/MUI.svg" },
    ],
  },
  {
    category: "Backend & Database",
    technologies: [
      { name: "Node.js", icon: "/nodejs.svg" },
      { name: "MongoDB", icon: "/MongoDb.png" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MySQL", icon: "/mysql.png" },
      { name: "Firebase", icon: "/firebase.png" },
    ],
  },
  {
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "S3", icon: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg" },
      { name: "Railway", icon: "https://railway.app/brand/logo-light.svg" },
      { name: "Vercel", icon: "/vercel.svg" },
    ],
  },
  {
    category: "Animation & Design",
    technologies: [
      { name: "Framer Motion", icon: "/Framer.webp" },
      { name: "GSAP", icon: "/GSAP.svg" },
    ],
  },
  {
    category: "Tools & Platforms",
    technologies: [
      { name: "GitHub", icon: "/Github.webp" },
      { name: "Vite", icon: "/vite.svg" },
    ],
  },
];

const TechStack = () => {
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <div className="py-20 px-[5%] md:px-[7%] lg:px-[10%]" id="TechStack">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="eyebrow mb-5">Technologies</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-luxe-gradient">My Tech Stack</span>
          </h2>
          <div className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-[#e6c078]/60 to-transparent" />
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Tools and technologies I use to bring ideas to life
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="space-y-12">
          {techStack.map((stack, stackIndex) => (
            <div key={stack.category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                <span className="text-[#e6c078]">›</span>
                {stack.category}
              </motion.h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {stack.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: techIndex * 0.1 }}
                    viewport={{ once: true }}
                    data-aos="fade-up"
                    data-aos-delay={techIndex * 100}
                    data-aos-duration="800"
                    className="premium-card group p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    {/* Tech Icon */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e6c078]/20 to-purple-600/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className={`w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300 ${
                          tech.name === "Railway" ? "p-2 bg-black/40 rounded-lg" : ""
                        } ${
                          tech.name === "S3" ? "p-1" : ""
                        }`}
                        loading="lazy"
                      />
                    </div>

                    {/* Tech Name */}
                    <p className="text-sm font-medium text-gray-300 text-center group-hover:text-white transition-colors duration-300">
                      {tech.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
