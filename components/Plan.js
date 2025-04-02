import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, Loader2, CheckCircle2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, when: "beforeChildren" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: index * 0.15, // ✅ Stagger items manually
    },
  }),
};

export default function Plan({ plan }) {
  return (
    <motion.div
      layout // Ensures smooth reflow when height changes
      className="grid gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}

      {/* Expanding List Container */}
      {plan ? (
        <motion.ul
          layout // Ensures smooth height expansion
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="timeline timeline-compact timeline-vertical overflow-hidden"
        >
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex gap-2 mb-2 items-center"
              variants={headerVariants}
            >
              <Clipboard strokeWidth={1.5} />
              <p className="font-bold text-xl">Planlægning</p>
            </motion.div>
            {plan.map((step, index) => (
              <motion.li
                key={step.title + index}
                custom={index} // ✅ Pass index for stagger effect
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                variants={itemVariants}
                layout // ✅ Ensures items below move smoothly
              >
                {index !== 0 && <hr className="bg-base" />}
                <div className="timeline-end shadow-sm timeline-box">
                  {step.title}
                </div>
                <div className="timeline-middle">
                  {step.status === "pending" &&
                  index > 0 &&
                  plan[index - 1].status === "pending" ? (
                    <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                      <div className="size-full bg-current animate-ping rounded-full" />
                    </div>
                  ) : step.status === "pending" ? (
                    <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                      <Loader2
                        strokeWidth={3}
                        stroke="#FFFFFF"
                        className="size-full animate-spin"
                      />
                    </div>
                  ) : (
                    <div className="size-4 m-1 p-0.5 rounded-full bg-primary grid place-items-center">
                      <CheckCircle2
                        strokeWidth={3}
                        stroke="#FFFFFF"
                        className="size-full"
                      />
                    </div>
                  )}
                </div>
                {plan.length - 1 !== index && (
                  <hr
                    className={
                      step.status === "pending" ? "bg-base" : "bg-primary"
                    }
                  />
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : null}
    </motion.div>
  );
}
