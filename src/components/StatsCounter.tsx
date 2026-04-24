"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Hours Coded", color: "text-blue-400" },
  { value: 2, suffix: "+", label: "Years Building", color: "text-purple-400" },
  { value: 10, suffix: "+", label: "Projects Shipped", color: "text-pink-400" },
  { value: 100, suffix: "%", label: "Passion Driven", color: "text-green-400" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-24 px-6 md:px-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold mb-4">By The Numbers</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl text-center group hover:border-white/20 transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br from-blue-500 to-purple-500`} />
              <div className={`text-5xl font-black tracking-tighter mb-2 ${stat.color}`}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
