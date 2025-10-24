"use client"
import { Card } from "@/components/ui/card";
import React, {useState, useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function ProfileCard() {
  const [load, setload] = useState(true);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [roadmap, setRoadmap] = useState([]);
  
  useEffect(()=> {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/userProfile/`, {  
      headers: { 
        "authorization" : localStorage.getItem("jwtToken") 
      }
    })
    .then(res => { 
      if (res.status === 201 && res.data.roadmaps && Array.isArray(res.data.roadmaps)) {
        setName(res.data.name);
        setEmail(res.data.email);
        setRoadmap(res.data.roadmaps)
        setload(false);
      }
    })
    .catch(err => {
      setload(false);
      console.error(err);
    }
  );
  },[])
  return (
    <div className="font-mono min-h-screen bg-black text-3xl font-semibold px-9 py-9">
      {
        load ? 
        <Loader/> :
        <div>
          <Card className="w-full h-full bg-neutral-800 max-w-9xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between bg-neutral-800 h-1/2">
              <div className="text-white text-base font-light mx-16 mt-7">
                <Link href={`/newRoadmap/`}>
                  <button 
                  className="px-7 py-4 rounded-xl mb-10 border-2 border-[#ff4d00] hover:bg-[#ff4d00]">
                    New Roadmap
                  </button>
                </Link>
                <h1>Name: <span className="text-[#ff4d00]">{name}</span></h1>
                <h1>Email: <span className="text-[#ff4d00]">{email}</span></h1>
              </div>
              <div className="my-10 md:my-7">
                <div className="w-40 h-40 rounded-full bg-[#ff4d00] border-4 mx-16">
                  
                </div>
              </div>
            </div>
          </Card>
          <div className="min-h-screen pt-5 bg-black md:pt-10 pb-4">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> */}
            <div className="flex justify-center flex-wrap-reverse gap-4">
              {roadmap.map((_, index) => (
                <Link key={index} href={`/chapterList/${roadmap[index]}`}>              
                  <Card
                    key={index}
                    className="py-6 px-6 bg-neutral-800 transition-transform transform hover:scale-105 hover:bg-neutral-800 shadow-lg hover:shadow-xl"
                    >
                    <h2 className="font-bold mb-2 text-lg text-white">{`Roadmap ${index+1} `}</h2>
                    <p className="text-neutral-500 text-sm">
                      click here mor more info.
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  );
}
