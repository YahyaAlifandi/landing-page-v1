import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState, useRef } from "react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setRotate({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      variants={item}
      className="max-w-xs w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-transform duration-150"
      style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px", // baru dianggap in-view kalau benar-benar sudah hampir masuk penuh
  });

  const cards = Array(4).fill(0);

  return (
    <motion.div
      ref={ref}
      className="flex justify-center items-center h-screen w-full flex-col gap-2"
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      <motion.p
        variants={item}
        className="border border-white/50 text-white rounded-full px-4 py-1"
      >
        Lorem ipsum dolor sit amet.
      </motion.p>

      <motion.h2
        variants={item}
        className="text-white text-3xl w-3xl text-center title"
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo, enim.
      </motion.h2>

      <motion.p
        variants={item}
        className="text-white/70 mt-2 text-sm w-6xl text-center"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
        molestiae aliquid, unde ipsum tenetur tempora.
      </motion.p>

      <motion.div
        className="flex w-full justify-center items-center gap-5 mt-10"
        variants={container}
      >
        {cards.map((_, i) => (
          <TiltCard key={i}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    alt="Airbnb logo"
                    className="w-10 h-10 rounded-full"
                    src="https://placehold.co/40x40/png?text=A"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-base">
                      Airbnb
                      <span className="text-gray-400 font-normal text-xs ml-2">
                        5 days ago
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Save job"
                  className="flex items-center space-x-1 text-gray-500 text-xs border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100"
                >
                  <i className="far fa-bookmark"></i>
                  <span>Save</span>
                </button>
              </div>
              <h2 className="font-bold text-gray-900 text-lg mb-3">
                Junior UI/UX Designer
              </h2>
              <div className="flex space-x-2 mb-6">
                <span className="bg-gray-300 text-gray-700 text-xs font-semibold rounded-md px-3 py-1">
                  Contract
                </span>
                <span className="bg-gray-300 text-gray-700 text-xs font-semibold rounded-md px-3 py-1">
                  Remote
                </span>
              </div>
              <hr className="border-gray-200 mb-6" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900 text-base">$100/hr</p>
                <p className="text-gray-500 text-xs">Delhi, India</p>
              </div>
              <button
                className="bg-black text-white text-sm font-semibold rounded-md px-5 py-2 hover:bg-gray-900"
                type="button"
              >
                Apply now
              </button>
            </div>
          </TiltCard>
        ))}
      </motion.div>
    </motion.div>
  );
}
