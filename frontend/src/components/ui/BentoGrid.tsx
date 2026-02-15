import React from 'react';
import { cn } from '../../utils/cn.ts';

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    return (
        <div className={cn("grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-none p-6 bg-slate-900 border-white/[0.1] border justify-between flex flex-col space-y-4 overflow-hidden relative",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200 flex flex-col flex-1 justify-end relative z-10">
                {icon}
                <div className="font-sans font-bold text-neutral-200 mb-2 mt-2 text-xl">
                    {title}
                </div>
                <div className="font-sans font-normal text-slate-400 text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
