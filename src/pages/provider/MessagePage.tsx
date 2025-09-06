import MessagingPlatform from "@/components/MessagingPlatform";

const MessagesPage = () => {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl p-2 font-bold">Messages</h1>
      </div>
      <MessagingPlatform />
    </div>
  );
};

export default MessagesPage;
