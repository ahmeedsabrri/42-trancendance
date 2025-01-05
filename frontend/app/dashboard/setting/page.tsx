"use client";
// import UpdateProfile from "./components/UpdateProfile";
// import Logout from "./components/logout";
// import ChangePassword from './components/ChangePassword';
// import OtpComponent from './components/OtpComponent';
// import UpdateForm from './components/UpdateForm';


// export default function Setting() {
//     return (
//         <div className="size-full h-3/5 p-4  flex flex-col justify-center border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-3xl px-24 py-10 ">
//             <div className="w-full h-full flex flex-col items-center gap-y-5 ">
//                 <div className="w-full h-24 flex flex-row items-center justify-between gap-6">
//                     <UpdateProfile/>
//                     <Logout/>
//                 </div>
//                 <hr  className="w-full border-white/25 my-2"/>
//                 <div className="w-full h-full flex flex-row gap-4">
//                     <div className="w-1/2 h-full flex flex-col items-start justify-center gap-5">
//                         <UpdateForm/>
//                     </div>
//                     <div className="w-1/2 h-full flex flex-col items-start justify-center gap-10">
//                        <ChangePassword/>
//                        <OtpComponent/>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from 'react';

import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';


export default function Settings() {
  return (
    <div className="w-5/6 h-5/6 overflow-scroll overflow-hidden border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-3xl">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="space-y-6">
          <ProfileSettings/>
          <SecuritySettings/>
        </div>
      </div>
    </div>
  );
}