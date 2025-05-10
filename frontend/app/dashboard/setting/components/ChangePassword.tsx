import ChangePasswordButton from "./ChangePasswordButton";
export default function ChangePassword() {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <h1 className="text-white font-bold">Password</h1>
                <hr  className="w-full border-white/25"/>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <ChangePasswordButton/>
                    <button className="border border-white/50 text-white rounded-3xl px-3 py-1 hover:bg-white/50 opacity-50"> Forget Password</button>
                </div>
            </div>
        </>
    );
}