import React, { useState } from 'react';
import { User, Upload, Camera } from 'lucide-react';
import Image from 'next/image';
import { UserData } from '@/app/store/store';
import  Avatar  from '../../app/Games/components/navbar/profilebar/Avatar';
import { useForm } from 'react-hook-form';
import { handelTwoFactor } from '@/app/dashboard/setting/action';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
type FormData = {
  username: string;
  password: string;
};
export function ProfileSettings( {user}: {user : UserData} ) {
  // task list
  // handel form update
  const tostNotify = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
  const Errotoast = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "",
    transition: Bounce,
  });
  const [formData, setFormData] = useState<FormData>({
    username: user.username,
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: FormData) => ({
            ...prevState,
            [name]: value,
          }));
      };
    const {
      handleSubmit,
      formState: { errors },
      setError,
    } = useForm<FormData>();
      
      
        
    const {handelUpdateUsername} = handelTwoFactor();
    const onSubmit = () => {
      handelUpdateUsername(formData.username, formData.password)
        .then((res) => {
          console.log("Logged in successfully");
          tostNotify('Profile updated successfully');
        })
        .catch((err) => {
          console.log(err);
          Errotoast(err.error);
          setError("root", { type   : "manual", message: err.error}); 
        });

      };
        // handel file upload
        const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('File input changed'); 
      
          if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log('Selected file:', file.name); 
      
            const formData = new FormData();
            formData.append('avatar', file); 
      
            try {
              console.log('Uploading file...'); 
              const response = await axios.put(
                'https://localhost/api/users/me/upload-avatar/',
                formData,
                { withCredentials: true }
              );
              console.log('Upload response:', response.data); 
              tostNotify('Avatar updated successfully');
            } catch (error) {
              console.error('Error uploading avatar:', error); 
              // Errotoast(error);
            }
          } else {
            console.log('No file selected'); 
          }
        };
        
  return (
    <div className="backdrop-blur-md rounded-lg p-6 space-y-6">
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
              // onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="relative inline-block">
          <Avatar width={100} height={100} avatar={user?.avatar}/>
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-black/50 hover:bg-black/70 cursor-pointer transition-all">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <form  
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Username
            </label>
            <input
              type="text"
              value={formData.username}
              name="username"
              onChange={handleChange}
              placeholder='username'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300/20 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={user.email}
              disabled
              placeholder='email'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/20 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='password'
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <button 
            className='w-full px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-all' 
            onClick={handleSubmit(onSubmit)}
            >

              {errors.root && (
                <span className="text-xs text-red">{errors.root.message}</span>
              )}
            <label htmlFor="" className='text-white'>
              save changes
            </label>
          </button>
        </form>
      </div>
    </div>
  );
}



