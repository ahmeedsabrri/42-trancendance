import { AuthActions } from "@/app/auth/utils";
import Image from "next/image";

export default function Logout() {
    const { logout} = AuthActions();

    const handleLogout = () => {
        logout()
          .then(() => {
            window.location.href = "/auth/login";
          })
          .catch(() => {
            });
        };


    return (
        <>
        <div className=" transition ease-in-out delay-150 w-25 h-25 flex flex-row items-center justify-center gap-3 border border-white/50 text-white rounded-3xl px-3 py-1 hover:bg-red hover:text-white/70 opacity-50">
            <button className="text-white bg-transparent border-none" onClick={handleLogout}>Log Out </button>
            <Image src="/images/logout-ico.svg" alt="" width={20} height={20}/>
        </div>
        </>
    );
}