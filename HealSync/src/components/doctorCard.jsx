// DoctorCard.jsx
import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

/**
 * DoctorCard Component
 * @param {object} props
 * @param {object} props.doctor - The doctor object ({ name: string, specialty: string })
 * @param {string} props.selectedDoctor - The currently selected doctor's name
 * @param {function} props.onSelect - Handler function to select this doctor
 */
const DoctorCard = ({ doctor, selectedDoctor, onSelect }) => {
    const isSelected = selectedDoctor === doctor.name;

    const baseClasses = "p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm";
    const selectedClasses = "border-indigo-600 ring-4 ring-indigo-200 bg-indigo-50 shadow-lg scale-[1.02]";
    const unselectedClasses = "border-gray-200 hover:border-indigo-400 hover:shadow-md bg-white";

    return (
        <div
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            onClick={() => onSelect(doctor.name)}
        >
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <UserIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-indigo-500 font-medium">{doctor.specialty}</p>
                </div>
            </div>
            {isSelected && (
                <div className="mt-2 text-xs font-semibold text-right text-indigo-700">
                    Selected ✔️
                </div>
            )}
        </div>
    );
};

export default DoctorCard;