"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className=" flex justify-center text-white flex-col items-center min-h-[44vh] gap-4">
        <div className="font-extrabold flex gap-2 justify-center items-center  text-5xl">
          {" "}
          Buy Me A Chai{" "}
          <span>
            {" "}
            <img
              src="https://png.pngtree.com/png-vector/20221230/ourmid/pngtree-fresh-milk-tea-or-indian-kadak-chai-free-png-image_6543027.png"
              width={50}
              alt=""
            />
          </span>
        </div>
        <p className="font-sans border px-2 py-1 bord bg-black ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
          deserunt excepturi eum nihil? Hic, fugiat.
        </p>
        <div className="flex gap-4">
          <Link href={"/login"}>
          <button
            type="button"
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start Now
          </button>
          </Link>
          <Link href={"/about"}>
          <button
            type="button"
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Read More
          </button>
          </Link>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      <div className="text-white container mx-auto">
        <h2 className="text-2xl font-bold text-center my-10">
          Your fans can buy you a chai{" "}
        </h2>
        <div className="flex gap-5 justify-around ">
          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/care.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>

          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/chat.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>

          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/around-the-world.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>
        </div>
      </div>



      <div className="bg-white h-1 opacity-10 mt-11"></div>

      <div className="text-white container mx-auto pb-10 ">
        <h2 className="text-2xl font-bold text-center my-10">
          Your fans can buy you a chai{" "}
        </h2>
        <div className="flex gap-5 justify-around ">
          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/customer.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>

          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/pay-per-click.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>

          <div className="items space-y-2 flex flex-col items-center justify-center">
            <img
              className=" rounded-3xl p-2 text-black"
              width={77}
              src="/rocket.gif"
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your fans are available to help you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10 mt-11"></div>

      <div className="text-white container mx-auto pb-10 ">
        <h2 className="text-2xl font-bold text-center my-10">
          Your fans can buy you a chai{" "}
        </h2>
        <div className="flex gap-5 justify-around ">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/l9U-G-Sh1vE?si=5sO_0GZrKBc23vfP" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
    </>
  );
}


