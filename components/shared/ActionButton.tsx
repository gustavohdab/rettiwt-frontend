'use client';

import React from 'react';

interface ActionButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    ActiveIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    active?: boolean;
    count?: number;
    activeColorClass?: string;
    defaultColorClass?: string;
    extraClasses?: string;
}

export default function ActionButton({
    onClick,
    Icon,
    ActiveIcon,
    active = false,
    count,
    activeColorClass = '',
    defaultColorClass = '',
    extraClasses = '',
}: ActionButtonProps) {
    const IconComponent = active && ActiveIcon ? ActiveIcon : Icon;
    const colorClass = active ? activeColorClass : defaultColorClass;

    return (
        <button
            onClick={onClick}
            className={`flex items-center transition duration-150 p-2 rounded-full hover:bg-[#1a1a1a] ${colorClass} ${extraClasses}`}
        >
            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            {typeof count === 'number' && (
                <span className="text-sm sm:text-base">{count}</span>
            )}
        </button>
    );
}
