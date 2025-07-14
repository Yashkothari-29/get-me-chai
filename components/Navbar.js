"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const [showdropdown, setShowdropdown] = useState(false);
  // if(session) {
  //   return <>
  //     Signed in as {session.user.email} <br/>
  //     <button onClick={() => signOut()}>Sign out</button>
  //   </>
  // }
  return (
    <nav className="bg-black text-white flex justify-between items-center p-4">
      <div className="logo font-extrabold text-xl">
        <Link href={"/"}> GET ME A CHAI!!!</Link>
      </div>
      <ul className="flex justify-between  items-center gap-2 ">
        {!session && (
          <Link
            href={"./"}
            className="border-2 border-slate-500 cursor-pointer hover:border-slate-300  rounded-xl py-1 px-2 text-lg font-normal  bg-black text-white"
          >
            Home
          </Link>
        )}
        {!session && (
          <Link
            href={"/about"}
            className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal  bg-black text-white"
          >
            About
          </Link>
        )}
        {!session && (
          <Link
            href={"/projects"}
            className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal  bg-black text-white"
          >
            Projects
          </Link>
        )}
        <Link
          href={"/creators"}
          className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white"
        >
          Creators
        </Link>
        {!session && (
          <Link
            href={"/signup"}
            className="border- rounded-full py-1 px-2 text-lg font-medium cursor-pointer border- bg-black text-white"
          >
            SignUp
          </Link>
        )}

        {session && (
          <Link href={"/dashboard"}>
            <button className="border- rounded-full py-1 px-2 text-lg font-medium cursor-pointer border- bg-white text-black">
              Dashboard
            </button>
          </Link>
        )}

        {session && (
          <button
            className="border-2 rounded-full py-1 px-2 text-lg font-medium border-white cursor-pointer border- bg-black text-white"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </button>
        )}
        <div className="relative inline-block text-left">
          {session && (
            <>
              <button
                onClick={() => setShowdropdown(!showdropdown)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowdropdown(false);
                  }, 300);
                }}
                id="dropdownDividerButton"
                data-dropdown-toggle="dropdownDivider"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                {/* Show profile photo if available */}
                {session.user.profilepic ? (
                  <img src={session.user.profilepic} alt="Profile" className="w-8 h-8 rounded-full mr-2 border-2 border-white" />
                ) : null}
                {session.user.email} {" "}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="dropdownDivider"
                className={`z-10 ${
                  showdropdown ? "" : "hidden"
                } bg-white divide-y absolute left-0 mt-2 divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDividerButton"
                >
                  <li>
                    <Link
                      href={`/${session.user.name}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </Link>
                  </li>
                </ul>
                <div className="py-2">
                  <Link
                    onClick={() => {
                      signOut();
                    }}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Log Out {session.user.email}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {!session && (
          <Link href={"login"}>
            <button
              className="border rounded-full py-1 px-2 text-lg font-medium cursor-pointer  bg-white text-black "
              onClick={() => {
                signIn();
              }}
            >
              Login
            </button>
          </Link>
        )}

        {/* <Link href={"login"} className='border rounded-full py-1 px-2 text-lg font-medium cursor-pointer  bg-white text-black ' >Login</Link> */}
      </ul>
      {/* <div>
<button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Blue</button>

<button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Teal to Lime
</span>
</button>
</div> */}
    </nav>
  );
};

export default Navbar;

