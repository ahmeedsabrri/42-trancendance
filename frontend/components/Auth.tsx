import React, { useState } from 'react';
import { KeyRound, User, Mail, Lock } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <AuthLayout>
      <div className="relative">
        <div className={`transform transition-all duration-500 ${isSignIn ? 'translate-x-0' : '-translate-x-full opacity-0 absolute'}`}>
          <SignIn onToggle={toggleMode} />
        </div>
        <div className={`transform transition-all duration-500 ${isSignIn ? 'translate-x-full opacity-0 absolute' : 'translate-x-0'}`}>
          <SignUp onToggle={toggleMode} />
        </div>
      </div>
    </AuthLayout>
  );
};

interface AuthFormProps {
  onToggle: () => void;
}

const SignIn: React.FC<AuthFormProps> = ({ onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
        <KeyRound className="w-8 h-8 text-white" />
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-white/80">Sign in to your account</p>
      </div>

      <div className="w-full space-y-4">
        <Input
          label="Username"
          placeholder="Enter your username"
          icon={<User className="w-5 h-5" />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<Lock className="w-5 h-5" />}
        />
      </div>

      <Button className="w-full">Sign In</Button>
      
      <Button 
        variant="secondary"
        className="w-full flex items-center justify-center gap-2"
      >
        <img src="https://42.fr/wp-content/uploads/2021/08/42-Final-sigle-seul.svg" 
             alt="42" 
             className="w-5 h-5" />
        Continue with 42
      </Button>

      <p className="text-white/80">
        Don't have an account?{' '}
        <button
          onClick={onToggle}
          className="text-white hover:underline font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

const SignUp: React.FC<AuthFormProps> = ({ onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
        <User className="w-8 h-8 text-white" />
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-white/80">Sign up for a new account</p>
      </div>

      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
          />
          <Input
            label="Last Name"
            placeholder="Doe"
          />
        </div>
        <Input
          label="Username"
          placeholder="Choose a username"
          icon={<User className="w-5 h-5" />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Choose a password"
          icon={<Lock className="w-5 h-5" />}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<Lock className="w-5 h-5" />}
        />
      </div>

      <Button className="w-full">Sign Up</Button>
      
      <Button 
        variant="secondary"
        className="w-full flex items-center justify-center gap-2"
      >
        <img src="https://42.fr/wp-content/uploads/2021/08/42-Final-sigle-seul.svg" 
             alt="42" 
             className="w-5 h-5" />
        Continue with 42
      </Button>

      <p className="text-white/80">
        Already have an account?{' '}
        <button
          onClick={onToggle}
          className="text-white hover:underline font-medium"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};