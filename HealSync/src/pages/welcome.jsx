import React from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  ShieldCheckIcon as AdminIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  ClockIcon,
  LockClosedIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  HeartIcon,
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
    className="flex flex-col p-6 sm:p-8 bg-white rounded-xl border border-gray-200
                   hover:border-indigo-500 hover:shadow-lg transition group relative"
  >
    <span
      className={`absolute top-0 left-0 h-1 w-full ${colorClass.iconBg} rounded-t-xl`}
    ></span>
    <div className="p-3 rounded-lg mb-3 sm:mb-4 bg-indigo-50 text-indigo-600 flex items-center justify-center">
      <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
      {title}
    </h3>
    <p className="text-gray-500 text-xs sm:text-sm flex-grow mb-3 sm:mb-4">
      {description}
    </p>
    <div className="flex items-center text-sm sm:text-base font-semibold text-indigo-600 mt-auto group-hover:text-indigo-800">
      Access Portal
      <ArrowRightIcon className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
    </div>
  </motion.a>
);

const FeatureCard = ({ title, description, icon: Icon }) => (
  <div
    className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl border border-gray-200
                    hover:bg-indigo-50 hover:shadow-md transition"
  >
    <Icon className="w-5 sm:w-7 h-5 sm:h-7 text-indigo-500 mb-2 sm:mb-3" />
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
    description: "AI-powered assistance for smart guidance and quick analysis.",
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
    description: "Streamlined, patient-centric flows reducing admin friction.",
  },
];

const WelcomePage = () => {
  const roles = [
    {
      title: "Patient Portal",
      description:
        "Access your medical history, prescriptions, and appointments — all in one place. Stay connected with your care team easily.",
      icon: UserIcon,
      link: "/login",
      colorClass: { iconBg: "bg-indigo-600" },
    },
    {
      title: "Physician Access",
      description:
        "Your doctor’s space — where they manage appointments, review patient charts, and collaborate for better care.",
      icon: BriefcaseIcon,
      link: "/login",
      colorClass: { iconBg: "bg-green-600" },
    },
    {
      title: "System Administrator",
      description:
        "For hospital admins to manage users, handle billing audits, and maintain system security and performance.",
      icon: AdminIcon,
      link: "/login",
      colorClass: { iconBg: "bg-gray-800" },
    },
  ];

  return (
    <div className=" bg-gray-50 flex flex-col items-center justify-center  ">
        
      <div className=" h-full w-full mx-auto space-y-10 sm:space-y-12">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-[#E3F4FF] via-[#F9FCFF] to-[#E3F4FF] overflow-hidden"
        >
          {/* Centered Container */}
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-0">
            {/* Left Side: Text Content */}
            <div className="text-center md:text-left md:w-1/2 flex flex-col gap-8 md:gap-10">
              <div>
                <h1 className="text-6xl sm:text-xl md:text-5xl font-extrabold text-blue-600 tracking-tight leading-tight">
                  <span className="text-gray-900">Heal</span>Sync
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mt-6 font-medium max-w-md mx-auto md:mx-0">
                  A secure platform that unifies patient care, operations, and
                  efficiency — making healthcare smarter, faster, and more
                  personal.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Link to="/ai" className="focus:outline-none">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all duration-300"
                  >
                    Consult AI Companion
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-2xl border border-blue-600 shadow-md transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-700 text-sm font-medium mt-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  🔒 <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  👩‍⚕️ <span>200+ Doctors</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  💙 <span>5,000+ Patients</span>
                </div>
              </div>
            </div>

            {/* Right Side: Floating Image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 1, -1.5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="w-full max-w-md bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden p-8"
              >
                <img
                  src="/Doctors-cuate.png"
                  alt="Doctor illustration"
                  className="object-contain w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* ROLE SELECTION CARDS */}
        <section className="bg-white px-6 sm:px-12 py-10 sm:py-14">

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12"
          >
            Select Your Portal
          </motion.h2>

          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {roles.map((role) => (
              <LoginCard key={role.title} {...role} />
            ))}
          </motion.div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="py-10 sm:py-12">

          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6"
            >
              Engineered for Healthcare Excellence
            </motion.h2>
            <p className="text-sm sm:text-lg text-gray-600 text-center mb-6 sm:mb-12">
              Built on security, efficiency, and cutting-edge technology.
            </p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {coreFeatures.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {valuePropositions.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl border border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="p-2 sm:p-3 rounded-md bg-indigo-100">
                    <point.icon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-lg font-bold text-gray-900">
                      {point.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center pt-4 sm:pt-6 mt-6 sm:mt-8 pb-6"

        >
          <p className="text-xs sm:text-base text-gray-500">
            Need an account or support?
            <a
              href="/"
              className="text-indigo-600 font-bold hover:text-indigo-800 transition ml-1 sm:ml-2 inline-flex items-center"
            >
              Contact Support
              <ArrowUpRightIcon className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
            </a>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default WelcomePage;
