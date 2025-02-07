'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SideBarItemProps {
    src: string;
    alt: string;
    title: string;
    link: string;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ src, alt, title, link }) => {
    return (
        <Link href={link}>
      <div className="flex items-center gap-x-2 hover:bg-gray-600/20 rounded-lg p-2">
        <div className="w-5 sm:w-7 lg:w-7 h-5 sm:h-6 lg:h-7 relative">
          <Image src={src} alt={alt} title={title} layout="fill" objectFit="cover" />
        </div>
      </div>
    </Link>
    );
};

export default SideBarItem;