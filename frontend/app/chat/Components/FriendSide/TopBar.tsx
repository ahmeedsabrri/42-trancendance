import { useUserStore } from "@/app/store/store";

const TopBar = () => {
    const user = useUserStore().user;
    
    if (!user)
        return <div className="text-2xl text-white pt-5"> Loading ... </div>;
    return (
        <div className="w-11/12 h-[10%] flex justify-start items-center ">
            <p className='text-white ml-4 text-sm font-bold overflow-hidden 2xl:text-3xl xl:text-2xl lg:text-xl md:text-md sm:text-sm p-2'>Messages</p>
        </div>
    );
}

export default TopBar;