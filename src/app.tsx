export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row items-center justify-center gap-4 bg-zinc-100 font-mono p-4">
      <textarea
        spellCheck={false}
        defaultValue="console.log('Hello World');"
        className="border border-zinc-300 rounded-md shadow-sm outline-none w-full h-full p-4 resize-none"
      />
      <div className="w-full h-full bg-black text-white rounded-md shadow-sm p-4">
        <p>Output</p>
      </div>
    </div>
  );
}
