import Chat from "@/components/chat";

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <Chat userId="demo-user" userName="Demo User" />
      </div>
    </main>
  );
}
