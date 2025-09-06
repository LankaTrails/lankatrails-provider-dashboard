import { MessageCircle } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center space-y-6 p-8 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
          <MessageCircle className="h-10 w-10 text-primary/60" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xl text-foreground">
            Select a conversation
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Choose a conversation from the sidebar to start messaging with your
            customers. Build relationships and provide excellent service!
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 opacity-50">
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
