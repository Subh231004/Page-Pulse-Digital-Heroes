import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Logo from "./Logo";

const navLinks = ["Vault", "Plans", "Install", "News", "Help"];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
};

const linkItemVariants = {
  hidden: { x: 24, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.18 + i * 0.07, duration: 0.4 },
  }),
};

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(25,40,55,0.35)", backdropFilter: "blur(4px)" }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 z-50 flex flex-col"
            style={{
              width: "min(88vw, 360px)",
              height: "100dvh",
              background: "#CFC8C5",
              boxShadow: "-12px 0 48px rgba(25,40,55,0.18)",
            }}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <motion.button
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(25,40,55,0.1)",
                }}
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} color="#192837" />
              </motion.button>
            </div>

            <div style={{ height: 1, background: "rgba(25,40,55,0.12)", margin: "0 24px" }} />

            <div className="flex flex-col gap-1 px-4 pt-6 pb-4">
              {navLinks.map((label, i) => (
                <motion.a
                  key={label}
                  href="#"
                  className="px-4 py-3 rounded-xl text-[#192837] transition-colors hover:bg-black/10"
                  style={{ fontSize: "1.1rem", fontWeight: 500 }}
                  variants={linkItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-3 px-6 mt-auto pb-8">
              <motion.button
                className="w-full rounded-full text-white font-semibold"
                style={{
                  padding: "14px 0",
                  fontSize: "0.95rem",
                  background: "#7342E2",
                }}
                whileTap={{ scale: 0.96 }}
              >
                Start For Free
              </motion.button>
              <motion.button
                className="w-full rounded-full font-semibold"
                style={{
                  padding: "14px 0",
                  fontSize: "0.95rem",
                  background: "#F2F2EE",
                  color: "#192837",
                }}
                whileTap={{ scale: 0.96 }}
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
