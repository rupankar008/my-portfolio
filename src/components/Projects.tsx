import { ExternalLink, Code } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Neon Velocity",
      description: "A brutalist, high-contrast e-commerce experience using Framer Motion and WebGL.",
      tags: ["Next.js", "Three.js", "Tailwind"],
      link: "#",
      github: "#",
      color: "from-purple-500/20 to-pink-500/20",
      border: "group-hover:border-pink-500/50"
    },
    {
      title: "Lumina AI",
      description: "Interface design and implementation for an advanced generative AI platform.",
      tags: ["React", "Typescript", "OpenAI"],
      link: "#",
      github: "#",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "group-hover:border-cyan-500/50"
    },
    {
      title: "Aura Dashboard",
      description: "Real-time analytics dashboard with custom D3.js visualizations and dark mode.",
      tags: ["Vue", "D3.js", "Node.js"],
      link: "#",
      github: "#",
      color: "from-green-500/20 to-emerald-500/20",
      border: "group-hover:border-emerald-500/50"
    },
    {
      title: "Quantum Pay",
      description: "A conceptual fintech app focusing on micro-interactions and smooth user flows.",
      tags: ["Next.js", "Framer Motion", "Stripe"],
      link: "#",
      github: "#",
      color: "from-orange-500/20 to-red-500/20",
      border: "group-hover:border-red-500/50"
    },
  ];

  return (
    <section id="projects" className="relative z-20 bg-[#050505] py-32 px-6 md:px-12 text-white overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 drop-shadow-2xl">
            Selected Works<span className="text-blue-500">.</span>
          </h2>
          <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={`glass rounded-3xl p-10 group transition-all duration-500 ease-out relative overflow-hidden shadow-2xl hover:-translate-y-2 border border-white/5 ${project.border}`}
            >
              {/* Vibrant hover glow effect based on project color */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-md">
                    {project.title}
                  </h3>
                  <p className="text-white/70 font-medium text-lg leading-relaxed mb-8 line-clamp-3">
                    {project.description}
                  </p>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-white/10 bg-black/50 text-white/90 shadow-inner backdrop-blur-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <a
                      href={project.link}
                      className="group/btn relative inline-flex items-center gap-2 text-sm font-bold text-black bg-white px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                    >
                      <ExternalLink size={18} />
                      <span>Live Site</span>
                    </a>
                    <a
                      href={project.github}
                      className="group/btn relative inline-flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 hover:scale-105 transition-all shadow-md active:scale-95"
                    >
                      <Code size={18} />
                      <span>Source</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
