import { useState } from "react";

export default function useChat() {
    const [showChat, setShowChat] = useState(false);

    const handleChat = () => {
        setShowChat(v => !v)
        console.log("Chat: ", showChat)
    }
    return {
        showChat,
        handleChat
    }
}