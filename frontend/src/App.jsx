import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";
import UrlForm from "./components/UrlForm";
import ReportCard from "./components/ReportCard";
import ErrorBanner from "./components/ErrorBanner";
import Footer from "./components/Footer";
import { auditUrl } from "./api/audit";

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

export default function App() {
  const [state, setState] = useState("idle");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (url) => {
    setState("loading");
    setReport(null);
    setError(null);
    try {
      const result = await auditUrl(url);
      setReport(result);
      setState("success");
    } catch (err) {
      setError({ code: err.code, message: err.message });
      setState("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 flex flex-col items-center justify-center px-5"
          style={{
            paddingTop: "clamp(40px, 8vw, 72px)",
            paddingBottom: 48,
          }}
        >
          <motion.h1
            className="text-center mb-2"
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
            Page Pulse
          </motion.h1>

          <motion.p
            className="text-center mb-8 max-w-md"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
              color: "var(--color-text)",
              opacity: 0.7,
              lineHeight: 1.65,
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Audit any public URL for basic SEO and accessibility signals.
          </motion.p>

          <motion.div
            className="w-full max-w-xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <UrlForm onSubmit={handleSubmit} loading={state === "loading"} />
          </motion.div>

          {state === "loading" && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-9 h-9 rounded-full border-4 mx-auto"
                style={{
                  borderColor: "rgba(115,66,226,0.2)",
                  borderTopColor: "#7342E2",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            </motion.div>
          )}

          <motion.div
            className="w-full mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={
              state === "success" || state === "error"
                ? { opacity: 1, y: 0 }
                : {}
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {state === "success" && <ReportCard report={report} />}
            {state === "error" && <ErrorBanner error={error} />}
          </motion.div>
        </main>

        <Footer />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
