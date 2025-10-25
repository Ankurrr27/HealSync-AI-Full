import React from 'react';
import { motion } from 'framer-motion';
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
} from '@heroicons/react/24/outline';

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
        className="flex flex-col p-8 bg-white rounded-xl border border-gray-200
                   hover:border-indigo-500 hover:shadow-lg transition group relative"
    >
        <span className={`absolute top-0 left-0 h-1 w-full ${colorClass.iconBg} rounded-t-xl`}></span>
        <div className="p-3 rounded-lg mb-4 bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm flex-grow mb-4">{description}</p>
        <div className="flex items-center text-sm font-semibold text-indigo-600 mt-auto group-hover:text-indigo-800">
            Access Portal
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
    </motion.a>
);

const FeatureCard = ({ title, description, icon: Icon }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200
                    hover:bg-indigo-50 hover:shadow-md transition">
        <Icon className="w-7 h-7 text-indigo-500 mb-3" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const coreFeatures = [
    { title: "Real-time Booking", icon: ClockIcon, description: "Manage appointments and time slots efficiently." },
    { title: "Secure Records", icon: LockClosedIcon, description: "HIPAA-compliant storage for patient data." },
    { title: "Intelligent Triage", icon: ChatBubbleBottomCenterTextIcon, description: "AI-driven support for guidance and analysis." },
    { title: "Performance Metrics", icon: ChartBarIcon, description: "Real-time metrics for clinic efficiency." },
];

const valuePropositions = [
    { title: "Scalable Cloud Infrastructure", icon: CloudArrowUpIcon, description: "Reliable uptime and performance across deployments." },
    { title: "Intuitive UX Design", icon: HeartIcon, description: "Streamlined, patient-centric flows reducing admin friction." },
];

const WelcomePage = () => {
    const roles = [
        {
            title: "Patient Portal",
            description: "Manage history, prescriptions, appointments, and communicate with your care team.",
            icon: UserIcon,
            link: "/patient-login",
            colorClass: { iconBg: "bg-indigo-600" },
        },
        {
            title: "Physician Access",
            description: "Review charts, manage schedules, dictate notes, and collaborate securely.",
            icon: BriefcaseIcon,
            link: "/physician-login",
            colorClass: { iconBg: "bg-green-600" },
        },
        {
            title: "System Administrator",
            description: "Manage users, billing audits, system settings, and monitor platform security.",
            icon: AdminIcon,
            link: "/admin-login",
            colorClass: { iconBg: "bg-gray-800" },
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 sm:p-10">
            <div className="max-w-6xl w-full mx-auto space-y-24">

                {/* HEADER */}
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center pt-10">
                    <div className="flex flex-col items-center mb-4">
                        <CalendarDaysIcon className="w-14 h-14 text-indigo-600 mb-2" />
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
                            <span className="text-indigo-700">HealthSync:</span> Enterprise Health Platform
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-4 font-normal">
                        Secure, HIPAA-compliant platform unifying patient care, operations, and efficiency.
                    </p>
                </motion.header>

                {/* ROLE SELECTION CARDS */}
                <section>
                    <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Select Your Portal
                    </motion.h2>

                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" variants={containerVariants} initial="hidden" animate="visible">
                        {roles.map((role) => (
                            <LoginCard
                                key={role.title}
                                title={role.title}
                                description={role.description}
                                icon={role.icon}
                                colorClass={role.colorClass}
                                link={role.link}
                            />
                        ))}
                    </motion.div>
                </section>

                {/* PLATFORM FEATURES */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2 initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Engineered for Healthcare Excellence
                        </motion.h2>
                        <p className="text-lg text-gray-600 text-center mb-12">
                            Built on security, efficiency, and cutting-edge technology.
                        </p>

                        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                            {coreFeatures.map((feature, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {valuePropositions.map((point, index) => (
                                <motion.div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                                    <div className="p-3 rounded-md bg-indigo-100">
                                        <point.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{point.title}</h4>
                                        <p className="text-sm text-gray-600">{point.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER CTA */}
                <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center pt-8 mt-12 pb-8">
                    <p className="text-base text-gray-500">
                        Need an account or support? 
                        <a href="/contact" className="text-indigo-600 font-bold hover:text-indigo-800 transition ml-2 inline-flex items-center">
                            Contact Support
                            <ArrowUpRightIcon className="w-4 h-4 ml-1"/>
                        </a>
                    </p>
                </motion.footer>
            </div>
        </div>
    );
};

export default WelcomePage;
