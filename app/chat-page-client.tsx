"use client";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/chat"), { ssr: false });

export default function ChatPageClient() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <Chat userId="demo-user" userName="Demo User" />
      </div>
    </main>
  );
}
