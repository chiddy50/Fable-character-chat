"use client"

import VictoryList from "@/components/chat-box/VictoryList";
import Link from "next/link";

export default function Home() {

	return (
        <div className="min-h-screen flex flex-col items-center justify-start mt-10 " style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}>
            <div className="w-full max-w-md  grid grid-cols-1 gap-4 ">
				<Link href="/agents" className="flex items-center justify-center bg-indigo-600 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-indigo-800 text-white rounded-lg p-5">
					<h1 className=" font-extrabold">Start Chat</h1>
				</Link>
				
				<VictoryList />

			</div>
		</div>
	);
}
