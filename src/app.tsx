import { useState } from "react";
import { getWebContainerInstance } from "./lib/web-container";
import ANSIToHTML from "ansi-to-html";
import { useAtom } from "jotai";
import { codeAtom } from "./atoms/code";

export default function App() {
  const [code, setCode] = useAtom(codeAtom);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const ANSIConverter = new ANSIToHTML();

  async function handleCodeRun() {
    if (isRunning) return;

    setIsRunning(true);
    setOutput([]);

    const webContainer = await getWebContainerInstance();

    await webContainer.mount({
      "app.js": {
        file: {
          contents: code,
        },
      },
    });

    const start = await webContainer.spawn("node", ["app.js"]);

    start.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput(state => [...state, ANSIConverter.toHtml(data)]);
        },
      })
    );

    setIsRunning(false);
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-4 p-4 bg-zinc-100 font-mono">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-xl">JavaScript WebContainer</h1>
        <button
          onClick={handleCodeRun}
          disabled={isRunning}
          className="bg-teal-600 text-white font-bold px-4 py-1 rounded-md shadow-sm disabled:bg-opacity-50 flex items-center justify-center gap-1"
        >
          {isRunning ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          )}
          <span>Run</span>
        </button>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
        <textarea
          value={code}
          onChange={event => setCode(event.target.value)}
          spellCheck={false}
          className="border border-zinc-300 rounded-md shadow-sm outline-none w-full h-full p-4 resize-none"
        />
        <div className="w-full h-full bg-black text-white rounded-md shadow-sm p-4">
          {output.map(line => (
            <p key={line} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </div>
      </div>
    </div>
  );
}
