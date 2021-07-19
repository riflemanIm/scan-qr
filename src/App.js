import React, { useState } from "react";
//import logo from './logo.svg';
import QrReader from "react-qr-reader";
import "./App.css";

function App() {
  const [state, setState] = useState([]);

  const handleScan = (data) => {
    if (data) {
      const totalUniq = [...new Set([...state, data])];
      setState(totalUniq);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="App">
      <div>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "300px", height: "300px" }}
        />
      </div>

      <div>
        <p>JSON:</p>
        <pre>{JSON.stringify(state, null, " ")}</pre>
      </div>
    </div>
  );
}

export default App;
