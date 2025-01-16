'use client'

interface CustomButtonProps {
    label: string;
    className: string;
    onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({label, className, onClick}) => {
    return (
        <button onClick={onClick} className={className}>
            {label}
        </button>
    )
}

export default CustomButton;