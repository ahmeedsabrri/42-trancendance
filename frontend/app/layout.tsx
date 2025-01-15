"use client";
import "./globals.css";
import { usePathname } from "next/navigation";

import SideBar from "@/components/sidebar/Sidebar";
import NavBar from "./Games/components/navbar/NavBar";
import { ToastContainer, Bounce } from "react-toastify";

// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const content = (pathname !== "/auth" ?
    <html lang="en">
      <body className="w-screen h-screen overflow-hidden flex justify-center items-center bg-background bg-center bg-no-repeat bg-cover" >
        <SideBar />
        <div className="p-[10px] w-[90%] h-[90%] flex flex-col justify-start items-center mx-8 gap-10">
          <NavBar />
          <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}/>
          {children}
        </div>
      </body>
    </html>
    :
    <html lang="en">
      <body className="bg-background bg-center bg-no-repeat bg-cover">
        {children}
      </body>
    </html>
  )

  return content;
}