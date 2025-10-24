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
    ArrowUpRightIcon, // New icon for external action
} from '@heroicons/react/24/outline';

// --- ANIMATION CONFIGURATION ---
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08, // Slightly faster stagger for a crisper feel
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Reduced y movement for subtlety
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        },
    },
};

// Component for a single login option card (Highly professional, minimal design)
const LoginCard = ({ title, description, icon: Icon, colorClass, link }) => (
    <motion.a
        href={link}
        variants={itemVariants}
        // Focus on a clean border/ring effect for hover, no big shadow
        className="flex flex-col items-start p-8 h-full bg-white rounded-xl border border-gray-200
                   transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-lg
                   group relative"
    >
        {/* Decorative Top Line - Subtle color accent */}
        <span className={`absolute top-0 left-0 h-1 w-full ${colorClass.iconBg} rounded-t-xl`}></span>

        {/* Icon Container - Now using the brand color for all icons for uniformity */}
        <div className={`p-3 rounded-lg mb-4 bg-indigo-50 text-indigo-600`}>
            <Icon className="w-6 h-6" />
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm flex-grow mb-4">{description}</p>

        {/* Action Link */}
        <div className="flex items-center text-sm font-semibold mt-auto text-indigo-600 transition duration-300 group-hover:text-indigo-800">
            Access Portal
            <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
    </motion.a>
);

// Feature Card Component (Simplified and cleaner)
const FeatureCard = ({ title, description, icon: Icon }) => (
    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200
                    transition-all duration-300 hover:bg-white hover:shadow-md">
        <Icon className="w-6 h-6 text-indigo-500 mb-2" />
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
    </div>
);

// Define core features
const coreFeatures = [
    { title: "Real-time Booking", icon: ClockIcon, description: "Securely manage appointments and time slots 24/7." },
    { title: "Secure Records", icon: LockClosedIcon, description: "Strict HIPAA-compliant data storage and patient privacy." },
    { title: "Intelligent Triage", icon: ChatBubbleBottomCenterTextIcon, description: "AI-driven support for preliminary guidance and operational analysis." },
    { title: "Performance Metrics", icon: ChartBarIcon, description: "Granular, real-time metrics for clinic efficiency and decision-making." }
];

// Define a new "About" section (now a Value Proposition section)
const valuePropositions = [
    { title: "Scalable Cloud Infrastructure", icon: CloudArrowUpIcon, description: "Ensures 99.99% uptime and reliable performance across global deployments." },
    { title: "Intuitive UX Design", icon: HeartIcon, description: "Streamlined, patient-centric flows reducing administrative friction by 40%." }
];


const WelcomePage = () => {
    const roles = [
        {
            title: "Patient Portal",
            description: "View history, manage prescriptions, schedule telehealth visits, and communicate with your care team.",
            icon: UserIcon,
            link: "/patient-login",
            colorClass: { iconBg: "bg-indigo-600" }, // Used for the accent line
        },
        {
            title: "Physician Access",
            description: "Review patient charts, dictate notes, manage schedules, and collaborate securely with specialists.",
            icon: BriefcaseIcon,
            link: "/physician-login",
            colorClass: { iconBg: "bg-green-600" }, // Using a different color for better distinction on the card
        },
        {
            title: "System Administrator",
            description: "Configure system settings, perform billing audits, manage user accounts, and monitor platform security.",
            icon: AdminIcon,
            link: "/admin-login",
            colorClass: { iconBg: "bg-gray-800" },
        },
    ];

    return (
        // Cleaned up background, focusing on simple contrast
        <div className="min-h-screen bg-white flex items-center justify-center p-6 sm:p-10">
            <div className="max-w-6xl w-full mx-auto space-y-20">
                
                {/* --- HEADER & WELCOME MESSAGE --- */}
                <motion.header 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                    className="text-center pt-10"
                >
                    <div className="flex flex-col items-center mb-4">
                        <CalendarDaysIcon className="w-12 h-12 text-indigo-600 mb-2" /> 
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
                            <span className="text-indigo-700">HealthSync:</span> Enterprise Health Platform
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-4 font-normal">
                        The secure, **HIPAA-compliant** platform that unifies patient care, clinical operations, and administrative efficiency.
                    </p>
                </motion.header>

                {/* --- ROLE SELECTION CARDS --- */}
                <section>
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl font-bold text-center text-gray-800 mb-12"
                    >
                        Select Your Dedicated Portal
                    </motion.h2>

                    <motion.div 
                        className="grid grid-cols-1 gap-10 md:grid-cols-3" 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
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

                {/* --- VALUE PROPOSITION / PLATFORM OVERVIEW --- */}
                <section className="mt-24 py-16 bg-gray-50 border-y border-gray-200">
                    <div className='max-w-4xl mx-auto'>
                        <motion.h2 
                            initial={{ opacity: 0, y: -10 }} 
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl font-bold text-center text-gray-800 mb-6"
                        >
                            Engineered for Healthcare Excellence
                        </motion.h2>
                        <p className="text-lg text-gray-600 text-center mb-12">
                            A modular platform built on security, efficiency, and cutting-edge technology.
                        </p>
                        
                        {/* Core Features */}
                        <motion.div 
                            className="grid grid-cols-2 gap-8 md:grid-cols-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {coreFeatures.map((feature, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <FeatureCard
                                        title={feature.title}
                                        description={feature.description}
                                        icon={feature.icon}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Value Points */}
                        <div className='mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {valuePropositions.map((point, index) => (
                                <motion.div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200" 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <div className='p-2 rounded-md bg-indigo-100'>
                                        <point.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900">{point.title}</h4>
                                        <p className="text-sm text-gray-600">{point.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* --- FOOTER CTA (Cleaned up) --- */}
                <motion.footer 
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center pt-8 mt-12 pb-8"
                >
                    <p className="text-base text-gray-500">
                        Need an account or technical support? 
                        <a href="/contact" className="text-indigo-600 font-bold hover:text-indigo-800 transition ml-2 inline-flex items-center">
                            Contact Support
                            <ArrowUpRightIcon className='w-4 h-4 ml-1'/>
                        </a>
                    </p>
                </motion.footer>

            </div>
        </div>
    );
}

export default WelcomePage;