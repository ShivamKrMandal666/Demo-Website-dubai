import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  once = true,
  duration = 0.8,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once, margin: "-80px 0px" }}
    transition={{ duration, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const RevealStagger = ({ children, className, stagger = 0.12, once = true }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once, margin: "-80px 0px" }}
    variants={{ show: { transition: { staggerChildren: stagger } } }}
  >
    {children}
  </motion.div>
);

export const RevealItem = ({ children, className, y = 26 }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    }}
  >
    {children}
  </motion.div>
);
