import { motion, Variants, Transition } from "framer-motion";
import { FunctionComponent } from "react";

import styles from "./loading-icon.module.scss";

const LoadingIcon: FunctionComponent = () => {
  const wrapperVariants: Variants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const pathVariants: Variants = {
    start: {
      rotateY: 0,
    },
    end: {
      rotateY: 360,
    },
  };

  const pathTransition: Transition = {
    duration: 0.5,
    ease: "easeInOut",
    loop: Infinity,
    repeatDelay: 2,
  };

  return (
    <motion.svg
      viewBox="0 0 264.86 192.88"
      className={styles.wrapper}
      initial="start"
      animate="end"
      variants={wrapperVariants}
    >
      <motion.path
        variants={pathVariants}
        transition={pathTransition}
        d="M81.81,150.15,69.19,192.88H0V0H51V150.15Z"
      />
      <motion.path
        variants={pathVariants}
        transition={pathTransition}
        d="M264.86,192.88h-54l-20.18-84.27c-5.34-20.48-8.9-40.36-14.24-61.13h-1.19c-5.34,20.77-9.19,40.65-14.24,61.13l-19.58,84.27H89.19L146.16,0h61.73Z"
      />
    </motion.svg>
  );
};

export default LoadingIcon;
