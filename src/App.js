import React, { useState } from "react";
//import logo from './logo.svg';
import QrReader from "react-qr-reader";
import "./App.scss";
import axios from "axios";
import isEmpty from "./helpers";

function App() {
  const [state, setState] = useState([
    // { scan: "cod=ЦБ-00322974;ser=00007522", num: 2 },
    // { scan: "cod=ЦБ-00322974;ser=00007523", num: 1 },
  ]);
  const [resultpost, setResultpost] = useState({});
  const [scaned, setScaned] = useState(false);

  const findedItem = (data) => state.find((it) => it.scan === data);
  const handleScan = (data) => {
    if (data != null) {
      setScaned(true);
      //const totalUniq = [...new Set([...state, data])];
      if (findedItem(data) != null) {
        let { scan, num } = findedItem(data);

        console.log("scan, num", scan, num);
        num++;
        setState([{ scan, num }, ...state.filter((it) => it.scan !== data)]);
      } else {
        setState([{ scan: data, num: 1 }, ...state]);
      }
    }
  };
  const [animate, setAnimate] = useState("");
  const handleMinus = (data) => {
    const isOk = window.confirm("Вы уверены?");
    if (!isOk) return;
    if (data != null) {
      //const totalUniq = [...new Set([...state, data])];

      if (findedItem(data) != null) {
        let { scan, num } = findedItem(data);
        console.log("scan, num", scan, num);

        if (num > 1) {
          num--;
          setState([{ scan, num }, ...state.filter((it) => it.scan !== data)]);
        } else {
          setState([...state.filter((it) => it.scan !== data)]);
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const backToScan = () => {
    setScaned(false);
    if (resultpost?.Nomer) {
      setResultpost({});
      setState([]);
    }
  };

  const saveData = async () => {
    const isOk = window.confirm("Вы уверены?");
    if (!isOk) return;
    const sendData = state
      .map((it) => `${it.scan};kol=${it.num};`)
      .join("\n")
      .trim();
    console.log(sendData);
    setAnimate("animate");

    // setTimeout(() => {
    //   setAnimate("");
    //   setResultpost({
    //     Nomer: "0000009",
    //   });
    // }, 3000);

    try {
      const { data } = await axios.post(
        "https://ctx.flowers-south.ru:8089/test4/hs/Obmen/QRCod/",
        sendData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic d2ViOlF3ZXJ0eTEyMw==",
            "Content-Type": "text/plain",
          },
        }
      );
      setAnimate("");
      console.log("!!!! data !!!!", data);
      setResultpost({ ...data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAnimate("");
        console.error("!!!! AxiosError !!!!", error);
      } else {
        setAnimate("");
        console.error("!!!! UnexpectedError !!!!", error);
      }
    }
  };
  //console.log("resultpost ", resultpost);
  return (
    <div className="App">
      {isEmpty(resultpost) ? (
        <>
          {!scaned && (
            <>
              <div className="qr-reader">
                <QrReader
                  //delay={50}
                  onError={handleError}
                  onScan={handleScan}
                  resolution={900}
                  style={{ width: "375px", height: "375px" }}
                  showViewFinder={true}
                />
              </div>

              <div className="flex-container">
                {state.map((it, inx) => (
                  <div className="row" key={inx}>
                    <div className="flex-item1">{it.scan}</div>
                    <div className="flex-item2">{it.num}</div>
                    <div className="flex-item3">
                      <button
                        className="but_minus"
                        dangerouslySetInnerHTML={{ __html: "&#x2212;" }}
                        onClick={() => handleMinus(it.scan)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!isEmpty(state) && (
            <p>
              <button
                onClick={saveData}
                className={`button success ${animate}`}
              >
                сохранить
              </button>
            </p>
          )}
        </>
      ) : (
        <>
          <h3>{resultpost?.Nomer}</h3>
          <button
            onClick={backToScan}
            className={`button scan success ${animate}`}
          >
            сканировать
          </button>
        </>
      )}
      {scaned && (
        <p style={{ marginTop: "50px" }}>
          <button onClick={backToScan} className={`button scan success `}>
            сканировать
          </button>
        </p>
      )}
    </div>
  );
}

export default App;
