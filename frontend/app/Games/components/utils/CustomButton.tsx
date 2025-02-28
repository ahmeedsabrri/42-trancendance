interface CustomButtonProps {
  label: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, className, onClick }) => {
  return (
    <button 
      className={className}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CustomButton; 