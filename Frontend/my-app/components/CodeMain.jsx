import { useRef, useState } from "react";

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

    const response = await fetch("http://localhost:3000/convert", {
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
      <div className="flex h-screen">

        {/* LEFT INPUT SECTION */}
        <div className="w-1/2 h-screen bg-gray-900 text-gray-100 p-6 space-y-6">

          {/* DROPDOWNS + BUTTON */}
          <div className="flex items-center justify-between gap-4">
            <select
              ref={coding}
              className="border p-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="">Coding Language</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
            </select>

            <select
              ref={conversion}
              className="border p-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="">Convert To</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
            </select>

            <button
              onClick={handleConvert}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
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
        <div className="w-1/2 bg-gray-900 p-6 overflow-auto">
          <h1 className="text-white font-bold mb-3">Converted Code:</h1>

          <pre className="text-white whitespace-pre-wrap bg-blue-600 p-4 rounded-lg shadow-lg">
            {result.convertedCode || "// No output yet"}
          </pre>
        </div>

      </div>
    </>
  );
}
