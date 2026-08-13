import React from "react";

export type TrashIconsProps = React.ComponentProps<'svg'> & {
    width?: number;
    height?: number;
    size?: number;
}

export const TrashIcon: React.FC<TrashIconsProps> = ({size = 24, width, height, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash"
         { ...props }>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-2 14H7L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V3h6v3"></path>
    </svg>
);