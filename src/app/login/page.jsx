"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from "@/components/Loader";
import axios from 'axios';

function Page() {
  const [load, setLoad] = useState(false);
  const [otpon, setOtpon] = useState(false);
  const [otpload, setOtpload] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const [buttonstate, setButtonState] = useState("Register");
  const [buttonerror, setButtonerror] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleOtp = async ()=>{
    if(formData.email){
      setOtpload(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/generate-otp`,{email: formData.email});
      if (response.status === 201) {
        console.log('res', response.data);
      }
      setOtpload(false);
      setOtpon(!otpon);
    } else {
      setOtpload(false);
      alert("please enter email");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, formData);
      if (response.status === 201) {
        setFormData({ email: '', password: '' });
        localStorage.setItem('jwtToken', response.data.token);
        setLoad(false);
        router.push("/profile");
      }
    } catch (error) {
      setLoad(false);
      setButtonerror(true);
      setButtonState(error.response.data)
      console.error(error);
    }
  };
  
  return (
    <div className="w-screen flex items-center justify-center">
      <div className="bg-neutral-950 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <h2 className="font-bold text-3xl text-neutral-400">
          Welcome to <span className="text-white">coding<span className="text-[#FF4D00]">आश्रम</span></span>
        </h2>
        <p className="text-md font-semibold max-w-sm mt-2 text-[#ff4d00]">login as a user</p>
        <p className="text-sm font-semibold max-w-sm mt-5 text-neutral-600">star(*) marked fields are mandatory to fill</p>
        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email">Email id*</label>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              id="email"
              placeholder="example@gmail.com"
              type="email"
              className="bg-neutral-200 text-black h-12 px-4 rounded-md w-full"
              required
              />
          </div>
          <div className="mb-2">
            <button disabled={otpload} className={`bg-neutral-500 hover:bg-[#FF4D00] duration-500 px-2 py-1 rounded-md text-xs disabled:cursor-not-allowed}`} onClick={handleOtp}>
              {
                otpload ? <p>wait</p> : <p>use OTP</p>
              }
            </button>
            {
              otpon ? 
              <button className="text-xs text-neutral-300 ml-2">OTP sent to <span className="text-[#FF4D00]">{formData.email}</span></button> :
              <></>
            }
          </div>
          <div className="mb-4">
            <label htmlFor="password">{otpon ? 'OTP' : 'Password'}*</label>
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              id="password"
              placeholder="••••••"
              type="password"
              className="bg-neutral-200 text-black h-12 px-4 rounded-md w-full"
              required
              />
          </div>
          <button
            type="submit"
            className={`bg-gradient-to-b from-neutral-800 to-neutral-900 dark:bg-zinc-800 w-full py-2 rounded-lg ${buttonerror ? 'font-extralight text-red-600' : 'text-[#FF4D00]'} ${formData.email || formData.password ? '' : 'pointer-events-none'}`}
          >
            {
              load ?
              <Loader/> :
              <div>{buttonstate}</div>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
