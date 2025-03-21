import React from "react";
import Editor from "./components/Editor";

const App = () => {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
        🚀 TripDocks Text Editor
      </h2>
      <Editor />
    </div>
  );
};

export default App;