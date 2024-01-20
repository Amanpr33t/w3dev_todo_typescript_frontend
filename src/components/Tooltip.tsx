import { useState } from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

//The component is tooltip
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(false)}
        >
            {children}
            {showTooltip && (
                <div className="opacity-100 bg-gray-700 text-white text-lg p-1 rounded-md absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {text}
                    <svg
                        className="absolute text-gray-700 h-2 top-full left-1/2 transform -translate-x-1/2"
                        x="0px"
                        y="0px"
                        viewBox="0 0 255 255"
                        xmlSpace="preserve"
                    >
                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Tooltip