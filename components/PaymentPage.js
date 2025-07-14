"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { initiate } from "@/actions/useractions";
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import { fetchuser, fetchpayments } from "@/actions/useractions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { notFound } from "next/navigation"

const PaymentPage = ({ username }) => {
  const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
  const [currentuser, setcurrentuser] = useState({});
  const [payments, setpayments] = useState([]);
  const searchParams = useSearchParams()
    const router = useRouter()
  
  const { data: session } = useSession(); 
  
  useEffect(() => {
    console.log("Username:", username);
    getData();
  }, [username]);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast('Thanks for your donation!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      getData(); // Refresh supporters list
      // Optionally, remove the query param from the URL after showing the toast
      // router.replace(`/${username}`);
    }
}, [searchParams]);

  
  const handleChange = (e) => { 
    setPaymentform({
      ...paymentform,
      [e.target.name]: e.target.value,
    });
  };
    
  const getData = async () => {
    let u = await fetchuser(username);
    console.log("Fetched user:", u);
    setcurrentuser(u);
  
    let dbpayments = await fetchpayments(username);
    console.log("Fetched payments:", dbpayments);
    setpayments(dbpayments);
  };
  
  const pay = async ({ amount }) => {
    console.log(session?.user.name);
    let a = await initiate(amount, username, paymentform);
    let orderid = a.id;
    
    var options = {
      key: process.env.NEXT_PUBLIC_KEY_ID, 
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      amount: amount,
      currency: "INR",
      name: "Yash Kothari",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderid,
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
  };

  const isOwnProfile = session && session.user && (session.user.username === username || session.user.name === username || session.user.email === currentuser.email);

  return (
    <>
    <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            {/* Same as */}
            <ToastContainer />
      {/* <button id="rzp-button1">Pay</button> */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      
      <div className="cover text-white w-full bg-red-50 relative">
        <img
          className="object-top object-cover w-full h-80"
          src={(currentuser && currentuser.coverpic) ? currentuser.coverpic : '/default-cover.jpg'}
          alt="Cover"
        />
        <div className="profilepicture absolute border border-3 -bottom-16 bg-white rounded-2xl right-[46%]">
          <img
            width={120}
            height={120}
            src={(currentuser && currentuser.profilepic) ? currentuser.profilepic : '/default-profile.jpg'}
            alt="Profile"
          />
        </div>
      </div>
      <div className="info text-white flex justify-center items-center my-16 flex-col gap-2">
        <div className="text-2xl font-bold">@{username}</div>
        <div className="text-slate-400 pt-1">
          Lets help {currentuser.name} to get a Chai!
        </div>
        <div className="text-slate-400 pb-9">
         {payments.length} Supporters •  ₹{payments.reduce((a, b) => a + b.amount, 0) / 100} Raised
        </div>

        <div className="flex gap-2 w-[80%]">
          <div className="supporter w-1/2 bg-slate-900 rounded-l-2xl text-white p-10">
            <h2 className="text-2xl font-bold my-5"> Supporters</h2>
            <ul className="mx-6 text-sm font-normal">
              {payments.length === 0 && <li>No Payments yet</li>}
              {payments.map((p, i) => (
                <li key={p.id || i} className="flex gap-2 items-center my-2">
                  <img
                    width={30}
                    className="filter invert-0"
                    src="profile.gif"
                    alt="profile image"
                  />
                  <span>
                    {p.name} Donated <span className="font-bold"> ₹{p.amount / 100} </span> with
                    Message "{p.message}"
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Only show payment UI if not own profile */}
          {!isOwnProfile && (
            <div className="makepayement w-1/2 bg-slate-900 rounded-r-2xl text-white p-10">
              <h2 className="text-xl font-bold my-5"> Make Payment</h2>
              <div className="flex gap-2 mt-5">
                <input
                  onChange={handleChange}
                  name="name"
                  value={paymentform.name}
                  className="border-2 border-slate-500 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white"
                  type="text"
                  placeholder="Name"
                />
                <input
                  name="message"
                  onChange={handleChange}
                  value={paymentform.message}
                  className="border-2 border-slate-500 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white"
                  type="text"
                  placeholder="Message"
                />
              </div>
              <div className="flex gap-2 pt-4 items-center">
                <input
                  name="amount"
                  onChange={handleChange}
                  value={paymentform.amount}
                  className="border-2 border-slate-500 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white"
                  type="text"
                  placeholder="Amount"
                />
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => pay({ amount: 1500 })} className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white">
                  ₹15
                </button>
                <button onClick={() => pay({ amount: 2500 })} className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white">
                  ₹25
                </button>
                <button onClick={() => pay({ amount: 5000 })} className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white">
                  ₹50
                </button>
                <button onClick={() => pay({ amount: 10000 })} className="border-2 border-slate-500 cursor-pointer hover:border-slate-300 rounded-xl py-1 px-2 text-lg font-normal bg-black text-white">
                  ₹100
                </button>
              </div>
              <button
                onClick={() => pay({ amount: paymentform.amount * 100 })}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Support with Custom Amount
              </button>
            </div>
          )}
          {/* If own profile, show stats or a message */}
          {isOwnProfile && (
            <div className="makepayement w-1/2 bg-slate-900 rounded-r-2xl text-white p-10 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold my-5">Your Creator Stats</h2>
              <div className="text-lg mb-2">Total Supporters: <span className="font-bold">{payments.length}</span></div>
              <div className="text-lg mb-2">Total Raised: <span className="font-bold">₹{payments.reduce((a, b) => a + b.amount, 0) / 100}</span></div>
              <div className="text-gray-400 mt-4">You cannot donate to yourself.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
