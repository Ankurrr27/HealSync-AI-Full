import React from 'react';
import { 
    UserIcon, 
    BriefcaseIcon, // Used for Doctor/Physician role for a professional look
    ShieldCheckIcon as AdminIcon, 
    CalendarDaysIcon, 
    ArrowRightIcon,
    ClockIcon, 
    LockClosedIcon, 
    ChatBubbleBottomCenterTextIcon, 
    ChartBarIcon
} from '@heroicons/react/24/outline';

// Component for a single login option card with enhanced styling
const LoginCard = ({ title, description, icon: Icon, colorClass, link }) => (
    <a 
        href={link}
        className="flex flex-col items-start p-6 h-full bg-white rounded-xl shadow-lg 
                   transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl 
                   ring-1 ring-gray-100 group"
    >
        {/* Icon Container - Prominent and distinct */}
        <div className={`p-3 rounded-xl mb-4 ${colorClass.iconBg} text-white shadow-md`}>
            <Icon className="w-7 h-7" />
        </div>
        
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm flex-grow mb-4">{description}</p>
        
        {/* Action Link */}
        <div className="flex items-center text-sm font-semibold mt-auto transition duration-300 group-hover:text-indigo-600">
            Secure Login
            <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
    </a>
);

// Define core features for the new section
const features = [
    { title: "Real-time Booking", icon: ClockIcon, description: "Instantly secure time slots and manage your appointments 24/7." },
    { title: "Secure Records", icon: LockClosedIcon, description: "HIPAA-compliant storage ensuring maximum patient privacy and data safety." },
    { title: "Integrated AI", icon: ChatBubbleBottomCenterTextIcon, description: "Get instant support and preliminary diagnostic guidance from HealthSync AI." },
    { title: "Performance Insights", icon: ChartBarIcon, description: "Physicians and Admins gain clear, real-time metrics on clinic operations." }
];


const WelcomePage = () => {

    // Define color palettes for each role
    const roles = [
        {
            title: "Patient Portal",
            description: "Access your medical history, manage prescriptions, schedule appointments, and communicate securely with your care team.",
            icon: UserIcon,
            link: "/login",
        
            colorClass: {
                iconBg: "bg-indigo-600",
            },
        },
        {
            title: "Physician Access",
            description: "Review patient charts, update clinical notes, manage your calendar, and collaborate with other specialists on patient care.",
            icon: BriefcaseIcon,
            link: "/login",
            colorClass: {
                iconBg: "bg-green-600",
            },
        },
        {
            title: "System Administrator",
            description: "Manage user accounts, configure system settings, handle billing audits, and monitor overall platform performance.",
            icon: AdminIcon,
            link: "/login",
            colorClass: {
                iconBg: "bg-gray-800",
            },
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 sm:p-10">
            {/* Reduced max-width for a less 'big' feel */}
            <div className="max-w-5xl w-full mx-auto space-y-12">
                
                {/* --- HEADER & WELCOME MESSAGE --- */}
                <header className="text-center pt-8">
                    <div className="flex justify-center items-center mb-4">
                        <CalendarDaysIcon className="w-10 h-10 text-indigo-600 mr-3" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                            Welcome to <span className="text-indigo-600">HealthSync</span>
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
                        The secure, unified platform for modern healthcare management. Please identify your role to proceed.
                    </p>
                </header>

                {/* --- ROLE SELECTION CARDS --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                </div>

                {/* --- PLATFORM KEY FEATURES SECTION (New, smaller section) --- */}
                <section className="mt-16 pt-12 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Platform Key Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-md ring-1 ring-gray-100">
                                <feature.icon className="w-6 h-6 text-indigo-500 mb-2" />
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>


                {/* --- FOOTER CTA (Cleaned up) --- */}
                <footer className="text-center pt-8 mt-12">
                    <p className="text-base text-gray-500">
                        If you do not have an account, or need assistance, please visit our 
                        <a href="/signup" className="text-indigo-600 font-bold hover:text-indigo-800 transition ml-1">Signup Page</a>.
                    </p>
                </footer>

            </div>
        </div>
    );
}

export default WelcomePage;
