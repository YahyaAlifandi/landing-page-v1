import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export default function Hero() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex justify-center items-center mr-auto w-full flex-col gap-5 h-screen"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex p-1 border border-gray-200/80 rounded-full items-center"
        variants={item}
      >
        <h2 className="text-white rounded-full border border-gray-200/80 px-3 font-bold">
          Ai
        </h2>
        <h2 className="text-white px-5 text-sm flex gap-2 items-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </h2>
      </motion.div>

      <motion.h2
        className="title text-5xl text-white font-medium text-center w-5xl"
        variants={item}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, eos!
      </motion.h2>

      <motion.p
        className="text-gray-200 w-[700px] text-sm text-center"
        variants={item}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum officia
        harum dicta. Nam hic earum nostrum quae cum qui illum.
      </motion.p>
      <motion.div className="flex gap-2 justify-center items-center mt-3">
        <motion.div
          variants={item}
          className="bg-white text-violet-500 px-5 py-2 rounded-md font-semibold hover:scale-105 duration-200 ease-out"
        >
          Demo School
        </motion.div>
        <motion.div
          variants={item}
          className="text-white border border-white px-5 py-2 rounded-md font-semibold hover:scale-105 duration-200 ease-out"
        >
          Sign Up Free
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
