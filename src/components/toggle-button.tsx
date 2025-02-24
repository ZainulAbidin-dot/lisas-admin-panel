import { useState } from 'react';

const ToggleButton = ({data}: any) => {
    const [isVerified, setIsVerified] = useState(data);

    const toggleVerification = () => {
        setIsVerified((prev: any) => !prev);
        console.log('Toggle verification');
    };

    return (
        <div className="flex items-center">
            <h1>Verification Status</h1>
            <button
                className={`relative w-16 h-8 rounded-full transition-colors duration-500 ease-in-out ${
                    isVerified ? 'bg-green-600' : 'bg-gray-600'
                }`}
                onClick={toggleVerification}
            >
                <span
                    className={`absolute left-0 top-0 w-8 h-8 rounded-full border-none shadow-lg transition-transform duration-500 ease-in-out ${
                        isVerified ? 'translate-x-full' : 'translate-x-0'
                    } bg-white`}
                />
            </button>
            <span className="ml-2 text-white">
                {isVerified ? 'Verified' : 'Not Verified'}
            </span>
        </div>
    );
};

export default ToggleButton;
