import { motion } from "framer-motion";
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HeroSection() {
  const iconProps = {
    size: 24,
    color: "#192837",
    style: {
      display: "inline",
      verticalAlign: "middle",
      position: "relative",
      top: -2,
      margin: "0 4px",
    },
  };

  return (
    <section className="relative z-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div
        style={{
          paddingTop: "clamp(40px, 8vw, 72px)",
          paddingBottom: "48px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <motion.h1
            className="text-center"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.65rem, 5vw, 3rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "var(--color-text)",
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              Lock <Zap {...iconProps} /> Down Your{" "}
              <LockKeyhole {...iconProps} /> Passwords
            </span>
            <br />
            <span>
              with Ironclad Security{" "}
              <Fingerprint
                size={24}
                color="#192837"
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  position: "relative",
                  top: -2,
                  marginLeft: 6,
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              color: "var(--color-text)",
              opacity: 0.8,
              maxWidth: 560,
              lineHeight: 1.65,
              margin: "0 auto",
              marginTop: "1rem",
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Zero stress, total control. Unbreakable storage, one-tap access,
            and pro-grade tools for your non-stop world.
          </motion.p>

          <motion.div
            className="flex justify-center mt-8"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <button
              className="flex items-center justify-between rounded-full text-white font-semibold transition-all"
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                padding: "17px 24px",
                minWidth: 210,
                background: "#7342E2",
                boxShadow: "0 4px 24px rgba(115,66,226,0.28)",
                borderRadius: 50,
                gap: 32,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.96)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
            >
              Get It Free
              <ArrowRightCircle size={20} color="#fff" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
