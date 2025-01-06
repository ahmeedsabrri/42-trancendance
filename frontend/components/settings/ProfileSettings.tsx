import React from 'react';
import { User, Upload, Camera } from 'lucide-react';
import Image from 'next/image';
import { UserData } from '@/app/store/store';

export function ProfileSettings( {user}: {user : UserData} ) {
  // task list
  // handel file upload
  // handel form update

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <User className="w-5 h-5" />
        Profile Settings
      </h2>

      <div className="space-y-6">
        <div className="relative">
          <Image
            src={"/images/banner.jpeg"}
            alt="Cover"
            width={0}
            height={0}
            className="w-full h-32 object-cover rounded-lg"
          />
          <label className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <div className="relative inline-block">
          <Image
            src={user.avatar}
            className="w-24 h-24 rounded-full object-cover"
            alt="Avatar"
            width={96}
            height={96}
          />
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-black/50 hover:bg-black/70 cursor-pointer transition-all">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Username
            </label>
            <input
              type="text"
              value={user.username}
              name="username"
              disabled
              placeholder='username'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={user.email}
              disabled
              placeholder='email'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Firstname
            </label>
            <input
              type="text"
              name="firstname"
              value={user.first_name}
              disabled
              placeholder='email'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Lastname
            </label>
            <input
              type="text"
              name="lastname"
              value={user.last_name}
              disabled
              placeholder='email'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}