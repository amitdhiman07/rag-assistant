import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f] font-sans">

      {/* Left Sidebar */}
      <div className="w-64 shrink-0 border-r border-white/[0.06] bg-[#141414] flex flex-col">
        <LeftPanel />
      </div>

      {/* Right Main Area */}
      <div className="flex-1 bg-[#fafafa] overflow-hidden flex flex-col">
        <RightPanel />
      </div>

    </div>
  );
}

export default App;