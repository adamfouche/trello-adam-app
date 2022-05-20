import "./App.scss";
import React from "react";
import AppBar from "components/AppBar/AppBar";
import Boardbar from "components/BoardBar/Boardbar";
import BoardContent from "components/BoardContent/BoardContent";
function App() {
  return (
    <div className="trello-adam-master">
      <AppBar />
      <Boardbar />
      <BoardContent />
    </div>
  );
}

export default App;
