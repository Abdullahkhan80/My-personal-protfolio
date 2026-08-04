import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 120);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Performant radial-gradient orbs instead of heavy blur filters */}
    <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] sm:w-[60rem] sm:h-[60rem] rounded-full bg-[radial-gradient(circle,rgba(230,192,120,0.10)_0%,transparent_70%)] animate-pulse" />
    <div className="absolute bottom-[-10%] left-[5%] w-[20rem] h-[20rem] sm:w-[40rem] sm:h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.10)_0%,transparent_70%)] animate-float-soft" />
    <div className="absolute bottom-[-15%] right-[2%] w-[18rem] h-[18rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07)_0%,transparent_70%)] animate-pulse" />
    {/* fine grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
  </div>
);

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const exitTimer = setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
      return () => clearTimeout(exitTimer);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.05
      }
    }
  };

  const childVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      y: -15,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014]"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
            <div className="mx-auto w-full max-w-4xl text-center">
              {/* Luxury eyebrow */}
              <motion.div
                className="mb-6 flex justify-center"
                variants={childVariants}
              >
                <span className="eyebrow">Developer Portfolio</span>
              </motion.div>

              {/* Welcome Text */}
              <motion.div
                className="mb-8 sm:mb-10"
                variants={childVariants}
              >
                <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl">
                  <span className="block bg-gradient-to-r from-white via-[#f7e7ce] to-purple-200 bg-clip-text text-transparent">
                    Create. Innovate.
                  </span>
                  <span className="mt-3 block text-luxe-gradient">
                    Build Amazing Things
                  </span>
                </h1>
              </motion.div>

              {/* Refined gold loader */}
              <motion.div
                className="relative flex items-center justify-center"
                variants={childVariants}
              >
                <div className="absolute h-16 w-16 rounded-full bg-[#e6c078]/20 blur-xl" />
                <svg className="animate-spin h-14 w-14 text-[#e6c078] mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </motion.div>

              {/* Website Link */}
              <motion.div
                className="mt-4"
                variants={childVariants}
              >
                <a
                  href="https://www.Abdullahprotfolio"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e6c078]/15 to-purple-600/15 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#e6c078]" />
                    <span className="text-gold-gradient font-medium">
                      <TypewriterEffect text="www.Abdullah" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
