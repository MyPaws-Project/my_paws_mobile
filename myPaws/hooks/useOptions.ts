import { useState } from "react";

export default function UseOptions() {
    const [showOptions, setShowOptions] = useState(false);

    const handleOptions = () => {
        setShowOptions(v => !v)
        console.log("Options: ", showOptions)
    }
    return {
        showOptions,
        handleOptions
    }
}