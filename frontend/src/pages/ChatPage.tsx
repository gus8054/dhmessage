import toast from "react-hot-toast";

function ChatPage() {
  return (
    <div>
      ChatPage
      <button onClick={() => toast.error("you clicked")}>Click m2e</button>
    </div>
  );
}

export default ChatPage;
