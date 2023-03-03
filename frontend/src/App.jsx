import { useMemo, useCallback, useEffect, useState } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { callReadOnlyFunction } from '@stacks/transactions';
import { StacksMocknet } from "@stacks/network";
import { stringUtf8CV, uintCV } from "@stacks/transactions";
import { ModelViewer } from "./components/ModelViewer";
import QRCode from "react-qr-code";


const model1 = new URL('./assets/bulbasaur.glb', import.meta.url).href;
const model2 = new URL('./assets/magikarp.glb', import.meta.url).href;
const model3 = new URL('./assets/minccino.glb', import.meta.url).href;
const modelURLs = [model1, model2, model3];

const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

function App() {
  const [votes, setVotes] = useState([]);
  const [message, setMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [userData, setUserData] = useState(undefined);
  const [xrModelId, setXRModelId] = useState(null);

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });
  const appDetails = {
    name: "Hello Stacks",
    icon: "https://freesvg.org/img/1541103084.png",
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const submitVote = useCallback(async (type) => {
    console.log("submit type", type);
    const network = new StacksMocknet();
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: "hello-stacks",
      functionName: "count-up",
      functionArgs: [uintCV(type)],
      network,
      appDetails,
      onFinish: () => {
        console.log("submit finish");
      }
    };
    await openContractCall(options);
  }, []);

  const retriveVote = useCallback(async (type) => {
    const network = new StacksMocknet();
    const senderAddress = userData.profile.stxAddress.testnet;

    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: "hello-stacks",
      functionName: "get-count",
      functionArgs: [uintCV(type)],
      network,
      senderAddress
    });
    return parseInt(result.value);
  }, [setVotes, userData]);

  const refreshVotes = useCallback(async () => {
    const newVotes = [];
    for (let i = 0; i < 3; i++) {
      const count = await retriveVote(i);
      newVotes[i] = count;
    }
    setVotes(newVotes);
  }, [setVotes, retriveVote]);

  useEffect(() => {
    if (!userData) return;
    refreshVotes();
  }, [userData, refreshVotes]);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const xrURL = useMemo(() => {
    if (xrModelId === null) return null;
    return `${import.meta.env.VITE_XR_SERVE_URL}/xr?id=${xrModelId}`;
  }, [xrModelId]);

  return (
    <div className="flex flex-col items-center h-screen gap-8 w-screen">
      <h1 className="text-5xl font-black" style={{margin: "50px"}}>Vote your favourite Pokemon!</h1>

      <div className="grid grid-cols-3 gap-10">
        {votes.map((v, index) => (
          <div key={index}>
            <ModelViewer modelURL={modelURLs[index]}/>
            <div className="grid grid-cols-2 gap-1">
              <button
                className="p-4 bg-indigo-500 rounded text-white"
                onClick={() => submitVote(index)}
              >
                Vote ({v})
              </button>
              <button
                className="p-4 bg-indigo-300 rounded text-white"
                onClick={() => setXRModelId(index)}
              >
                XR View
              </button>
            </div>
          </div>
        ))}
      </div>

      {!userData && (
        <button
          className="p-4 bg-indigo-500 rounded text-white"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {xrModelId !== null && (
        <div style={{
          position: "absolute", width: "600px", height: "400px", background: "#DDDDDD",
          color: "black",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <h3>XR view (scan with your mobile device)</h3><br/>
          <button style={{position: "absolute", right: 0, top: 0, padding: 5, color: "white"}}
            onClick={() => {setXRModelId(null)}}
          >X</button>
          <div>{xrURL}</div>
          <QRCode size={256} value={xrURL}/>
        </div>
      )}
   </div>
  );
}

export default App;
