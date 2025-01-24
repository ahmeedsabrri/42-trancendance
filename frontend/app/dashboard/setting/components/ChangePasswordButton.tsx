import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


export default function ChangePasswordButton() {
    return (
        <Dialog>
                    <DialogTrigger asChild>
                        <button className="border border-white/50 text-white rounded-3xl px-3 py-1 hover:bg-white/50 hover:text-white/70 opacity-50"> Change Password</button>
                    </DialogTrigger>
                <DialogContent className="bg-zinc-600/10 border-white/25 p-4 rounded-full backdrop-blur-md w-6/12 h-1/2 flex flex-col items-center justify-start gap-10 py-16">
                    <DialogHeader>
                        <DialogTitle className="text-white font-bold">Change Password</DialogTitle>
                        <DialogDescription>
                            Make changes to your Password here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right text-white opacity-50">
                                Old Password
                            </label>
                            <input id="name"  className="bg-transparent  text-white/25 backdrop-blur-lg p-2 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" type="password"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right text-white opacity-50">
                                New Password
                            </label>
                            <input id="name"  className="bg-transparent  text-white/25 backdrop-blur-lg p-2 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" type="password"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right text-white opacity-50">
                                Confirm Password
                            </label>
                            <input id="name"  className="bg-transparent  text-white/25 backdrop-blur-lg p-2 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" type="password"/>
                        </div>
                    </div>
                        <DialogFooter>
                            <button type="submit" className="transition ease-in-out delay-150 bg-black text-white font-bold bg-black/15 backdrop-blur-lg  rounded-full p-2 my-2 w-[250px] h-[50px] hover:bg-zinc-900 drop-shadow-2xl border-b-2 border-white/10">Save changes</button>
                        </DialogFooter>
                </DialogContent>
        </Dialog>
    );
}