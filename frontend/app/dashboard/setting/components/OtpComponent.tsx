import { Switch } from "@/components/ui/switch"
export default function OtpComponent() {
    return (
        <>
            <div className='flex flex-col items-start justify-center gap-4'>
                <h1 className="text-white font-bold">Two Factor Authentication</h1>
                <hr  className="w-full border-white/25"/>
                <div className='flex flex-row items-center justify-start gap-4'>
                    <label htmlFor="2FA" className='text-white text-sm opacity-50'> Enable 2fa</label>
                    <Switch/>
                </div>
            </div>
        </>
    );
}