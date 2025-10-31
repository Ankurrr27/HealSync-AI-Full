import React from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  ShieldCheckIcon as AdminIcon,
  ClockIcon,
  LockClosedIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  HeartIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const LoginCard = ({ title, description, icon: Icon, colorClass, link }) => (
  <motion.a
    href={link}
    variants={itemVariants}
    className="flex flex-col p-5 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-xl transition group relative"
  >
    <span
      className={`absolute top-0 left-0 h-1 w-full ${colorClass.iconBg} rounded-t-xl`}
    ></span>
    <div
      className={`p-3 rounded-lg mb-3 ${colorClass.iconBg.replace(
        "bg-",
        "bg-opacity-20 text-"
      )} flex items-center justify-center`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
      {title}
    </h3>
    <p className="text-xs sm:text-sm text-gray-500 flex-grow mb-3">
      {description}
    </p>
    <div className="flex items-center text-sm font-semibold text-blue-600 mt-auto group-hover:text-blue-800">
      Access Portal
      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
    </div>
  </motion.a>
);

const FeatureCard = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl border border-gray-200 hover:bg-blue-50 hover:shadow-md transition">
    <Icon className="w-7 h-7 text-blue-500 mb-2 sm:mb-3" />
    <h4 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
      {title}
    </h4>
    <p className="text-xs sm:text-sm text-gray-500">{description}</p>
  </div>
);

const coreFeatures = [
  {
    title: "Real-time Booking",
    icon: ClockIcon,
    description: "Easily manage appointments and time slots in real time.",
  },
  {
    title: "Secure Records",
    icon: LockClosedIcon,
    description: "Safely store and protect patient information.",
  },
  {
    title: "Intelligent Triage",
    icon: ChatBubbleBottomCenterTextIcon,
    description: "AI-powered assistance for quick analysis.",
  },
  {
    title: "Posture Corrector",
    icon: ChartBarIcon,
    description: "Monitor and improve posture with real-time feedback.",
  },
];

const valuePropositions = [
  {
    title: "Scalable Cloud Infrastructure",
    icon: CloudArrowUpIcon,
    description: "Reliable uptime and performance across deployments.",
  },
  {
    title: "Intuitive UX Design",
    icon: HeartIcon,
    description: "Streamlined, patient-centric experience.",
  },
];

const WelcomePage = () => {
  const roles = [
    {
      title: "Patient Portal",
      description:
        "Access your medical history, prescriptions, and appointments — all in one place.",
      icon: UserIcon,
      link: "/login",
      colorClass: { iconBg: "bg-blue-600" },
    },
    {
      title: "Physician Access",
      description:
        "Doctors manage appointments, review charts, and collaborate for better care.",
      icon: BriefcaseIcon,
      link: "/login",
      colorClass: { iconBg: "bg-green-600" },
    },
    {
      title: "System Administrator",
      description:
        "Admins manage users, billing audits, and maintain system security.",
      icon: AdminIcon,
      link: "/login",
      colorClass: { iconBg: "bg-gray-800" },
    },
  ];

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full mx-auto space-y-10 sm:space-y-12">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col md:flex-row items-center justify-center min-h-[90vh] md:min-h-screen bg-gradient-to-br bg-transparent from-blue-50 via-white to-cyan-50 overflow-hidden"
        >
          <div className="max-w-7xl w-full flex flex-col md:flex-row-reverse items-center justify-between px-6 bg-transparent sm:px-10 lg:px-16 py-4 md:py-0">
            {/* Right Side (Image) */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="w-[90%] sm:w-full max-w-sm sm:max-w-md bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden p-6 sm:p-8"
              >
                <img
                  src="/Doctors-cuate.png"
                  alt="Doctor illustration"
                  className="object-contain w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            </motion.div>

            {/* Left Side (Text) */}
            <div className="text-center md:text-left md:w-1/2 flex flex-col gap-6 md:gap-10">
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-blue-500 tracking-tight leading-tight">
                  <span className="text-gray-900">Heal</span>Sync
                </h1>
                <p className="text-xs sm:text-lg md:text-xl text-gray-600 mt-4 px-4 sm:px-6 md:px-0 font-medium max-w-2xl text-center md:text-left leading-relaxed">
                  A secure platform that unifies patient care, operations, and
                  efficiency — making healthcare smarter and more personal.
                </p>
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-start  sm:justify-start sm:gap-6  m-0  ">
                <Link to="/ai" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 sm:px-8 rounded-2xl shadow-lg text-sm sm:text-base transition-all duration-300"
                  >
                    Consult AI Companion
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white text-blue-500 hover:text-blue-700 font-semibold py-3 px-6 sm:px-8 rounded-2xl border border-blue-500 shadow-md text-sm sm:text-base transition-all duration-300 hover:bg-blue-50"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-3 text-gray-700 text-sm font-medium mt-6 flex-wrap md:flex-nowrap items-center">
                {[
                  ["🔒", "100% Secure"],
                  ["👩‍⚕️", "200+ Doctors"],
                  ["💙", "5,000+ Patients"],
                ].map(([emoji, text], i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md border border-gray-200 whitespace-nowrap hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-lg">{emoji}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.header>

        {/* ROLE CARDS */}
        <section className="bg-white px-5 sm:px-10 lg:px-20 py-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8"
          >
            Select Your Portal
          </motion.h2>

          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {roles.map((role) => (
              <LoginCard key={role.title} {...role} />
            ))}
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="py-10 sm:py-14 px-5 sm:px-10 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4"
            >
              Engineered for Healthcare Excellence
            </motion.h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8">
              Built on security, efficiency, and innovation.
            </p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {coreFeatures.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 border-t pt-6 border-gray-200">
              {valuePropositions.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-5 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-600 transition"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="p-3 rounded-md bg-blue-100 flex-shrink-0">
                    <point.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {point.title}
                    </h4>
                    <p className="text-sm text-gray-600">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-4 pb-8"
        >
          <p className="text-xs md:text-sm text-gray-500">
            Need an account or support?
            <a
              href="/"
              className="text-blue-600 font-semibold hover:text-blue-800 ml-1 inline-flex items-center"
            >
              Contact Support
              <ArrowUpRightIcon className="w-4 h-4 ml-1" />
            </a>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default WelcomePage;
