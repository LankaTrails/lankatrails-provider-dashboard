import MessagingPlatform from "@/components/MessagingPlatform";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

const MessagesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Messages</h1>
        <ProviderTopBar />
      </div>
      <MessagingPlatform />
    </div>
  );
};

export default MessagesPage;
