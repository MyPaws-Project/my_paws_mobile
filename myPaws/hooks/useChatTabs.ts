import { useState } from "react";

export default function useChatTabs() {
    const [showFirstTab, setShowFirstTab] = useState(true);
    const [showSecondTab, setShowSecondTab] = useState(false);

    const handleFirstTab = () => {
        if (showFirstTab) {
            return
        } else {
            setShowFirstTab(true);
            setShowSecondTab(false);
        }
    }
    const handleSecondTab = () => {
        if (showSecondTab) {
            return
        } else {
            setShowSecondTab(true);
            setShowFirstTab(false);
        }
    }
    return {
        showFirstTab,
        showSecondTab,
        handleFirstTab,
        handleSecondTab,
    }
}