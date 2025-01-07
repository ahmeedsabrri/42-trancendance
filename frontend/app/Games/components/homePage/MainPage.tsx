'use client'

interface MainPageProps {
    children: React.ReactNode;
    navbar?: React.ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children , navbar}) => {
    return (
        <div className="p-[10px] w-[80%] h-[80%] flex flex-col justify-start items-center gap-y-[6px]">
            { navbar }
            { children }
        </div>
    )
}

export default MainPage;