import { useRef, useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;

export function CodeMain() {
  const coding = useRef(null);
  const conversion = useRef(null);
  const code = useRef(null);

  const [result, setResult] = useState({
    convertedCode: "",
    convertedTo: "",
  });

  // FUNCTION TO CLEAN BACKEND OUTPUT
  const cleanCode = (raw) => {
    if (!raw) return "";

    // Remove ```python / ```javascript etc
    return raw
      .replace(/```[a-zA-Z]*/g, "") // remove ```python
      .replace(/```/g, "")          // remove ending ```
      .trim();
  };

  const handleConvert = async () => {
    const fromLang = coding.current.value;
    const toLang = conversion.current.value;
    const sourceCode = code.current.value;

    const response = await fetch(`${API_URL}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceCode, fromLang, toLang }),
    });

    const data = await response.json();

    setResult({
      convertedCode: cleanCode(data.convertedCode),
      convertedTo: data.convertedTo,
    });
  };

  return (
  <>
    <div className="flex flex-col lg:flex-row h-screen">

      {/* LEFT INPUT SECTION */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen bg-gray-900 text-gray-100 p-6 space-y-6">

        {/* DROPDOWNS + BUTTON */}
        <div className="flex items-center justify-between gap-4">
          <select
            ref={coding}
            className="border p-2 rounded-lg bg-gray-800 text-white w-full"
          >
            <option value="">Coding Language</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>

          <select
            ref={conversion}
            className="border p-2 rounded-lg bg-gray-800 text-white w-full"
          >
            <option value="">Convert To</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>

          <button
            onClick={handleConvert}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Convert
          </button>
        </div>

        {/* CODE INPUT */}
        <textarea
          ref={code}
          className="w-full h-full bg-gray-800 text-gray-100 p-4 rounded-lg outline-none resize-none"
          placeholder="// Type your code here..."
        ></textarea>

      </div>

      {/* RIGHT OUTPUT SECTION */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen bg-gray-900 p-6 overflow-auto">

        <h1 className="text-white font-bold mb-3">Converted Code:</h1>

        <div className="relative">

          {/* Copy Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.convertedCode || "");

              const btn = document.getElementById("copy-btn");
              const text = document.getElementById("code-text");

              btn.innerText = "Copied!";
              text.classList.add("text-flash");

              setTimeout(() => {
                btn.innerText = "Copy📋";
                text.classList.remove("text-flash");
              }, 800);
            }}
            id="copy-btn"
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Copy📋
          </button>

          {/* Code Output */}
          <pre className="whitespace-pre-wrap bg-blue-600 p-4 rounded-lg shadow-lg mt-8 h-full">
            <code
              id="code-text"
              className="text-white transition-all duration-300"
            >
              {result.convertedCode || "// No output yet"}
            </code>
          </pre>
        </div>

      </div>

    </div>
  </>
)};
