import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // delay 100ms antar elemen
    },
  },
};

const item: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "backInOut" },
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={`flex fixed top-0 justify-between items-center p-5 text-sm left-0 right-0 ${isScrolled ? 'border border-white/20 rounded-lg my-2 py-2' : 'border-none'}`}
      animate={{
        backdropFilter: isScrolled ? "blur(10px)" : "blur(0px)",
        width: isScrolled ? "80%" : '100%',
        marginInline: isScrolled ? 'auto' : 'auto',
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.h2
        className={`text-2xl font-bold text-white ${isScrolled ? 'mr-32' : 'mr-32'}`}
        variants={item}
      >
        PangudiDev
      </motion.h2>

      {/* Menu */}
      <motion.div
        className="flex gap-8 bg-black/10 border-white/50 border rounded-full py-3 px-10 text-white font-semibold"
        variants={container}
      >
        {["Home", "About", "Product", "Contact Us"].map((text, i) => (
          <motion.a
            key={i}
            href="#"
            className="hover:scale-105 duration-300 hover:font-bold"
            variants={item}
          >
            {text}
          </motion.a>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div className="flex gap-2" variants={container}>
        {[
          {
            label: "Sign In",
            class:
              "rounded-sm px-3 py-[7px] text-white font-semibold duration-300",
          },
          {
            label: "Sign Up",
            class:
              "rounded-sm px-3 pr-5 py-[7px] text-white font-semibold duration-300",
          },
          {
            label: "Demo App",
            class:
              "bg-white rounded-sm px-7 py-[7px] text-violet-600 hover:bg-white font-semibold duration-300",
          },
        ].map((btn, i) => (
          <motion.div key={i} className={btn.class} variants={item}>
            {btn.label}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
