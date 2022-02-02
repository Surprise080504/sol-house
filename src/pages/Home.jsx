import React, { useState, useEffect } from "react"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import discordIMG from '../assets/discord.png'
import twitterIMG from '../assets/twitter.png'
import instagramIMG from '../assets/instagram.png'
import phoneIMG from '../assets/phone.png'
import meIMG from '../assets/me.png'
import Header from "../components/Header"
import { MyBet } from "../components/tables/MyBet"
import { AllBets } from "../components/tables/AllBets"
import { Highrollers } from "../components/tables/Highrollers"
import { HubConnectionBuilder } from '@microsoft/signalr'
import Unity, { UnityContext } from "react-unity-webgl";
import { getDatabase, ref, onValue } from "firebase/database";
import splashVideo from '../assets/splash-video.mp4'
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyBym5T2FeszmnlokZdfnbaw7_igLU6PnCM",
    authDomain: "soljack.firebaseapp.com",
    databaseURL: "https://soljack-default-rtdb.firebaseio.com",
    projectId: "soljack",
    storageBucket: "soljack.appspot.com",
    messagingSenderId: "662780127233",
    appId: "1:662780127233:web:3aa022ee43673eab7e3800",
    measurementId: "G-3HGDP65XTY"
};
// This is the context that Unity will use to communicate with the React app.
const unityContext = new UnityContext({
    loaderUrl: "unitybuild/Builds.loader.js",
    dataUrl: "unitybuild/Builds.data.unityweb",
    frameworkUrl: "unitybuild/Builds.framework.js.unityweb",
    codeUrl: "unitybuild/Builds.wasm.unityweb",
    streamingAssetsUrl: "unitybuild/streamingassets",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });
export const HomePage = () => {
    const app = initializeApp(firebaseConfig);
      // The app's state.
  const [isLoaded, setIsLoaded] = useState(false);
  const [progression, setProgression] = useState(0);
  const unityCtx = unityContext;
  // When the component is mounted, we'll register some event listener.
  useEffect(() => {
    unityContext.on("canvas", handleOnUnityCanvas);
    unityContext.on("progress", handleOnUnityProgress);
    unityContext.on("loaded", handleOnUnityLoaded);
    controlSplashScreen()
    listenToRealtimeDB()
    // When the component is unmounted, we'll unregister the event listener.
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  // Built-in event invoked when the Unity canvas is ready to be interacted with.
  function handleOnUnityCanvas(canvas) {
    const context = canvas.getContext("webgl");
    const contextAttributes = context?.getContextAttributes();
    console.log(contextAttributes);
    canvas.setAttribute("role", "unityCanvas");
  }
  const listenToRealtimeDB = () => {
    try {
        const db = getDatabase();
        const dbRef = ref(db);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            console.log('======>', data.ServerStatus)
            setServerStatus(data.ServerStatus);
            unityContext.send("Game Manager", "SetServerStatus", data.ServerStatus);
            unityContext.send("Game Manager", "SetMessage", data.StartMessage);
        });
    }
    catch (e) {
        console.log(e)
    }
}
  const controlSplashScreen = () => {
    const splashScreen = document.querySelector('#frame-splash')

    setTimeout(() => {
        splashScreen.style.display = 'none'
    }, 6000)
}
  // Built-in event invoked when the Unity app's progress has changed.
  function handleOnUnityProgress(progression) {
    setProgression(progression);
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Built-in event invoked when the Unity app is loaded.
  async function handleOnUnityLoaded() {
      await sleep(1000);
      setIsLoaded(true);
      listenToRealtimeDB();
  }
    const [blockhash, setBlockhash] = useState("0");
    const [serverStatus, setServerStatus]=useState("Down")
    var [withdrawalBlockhash, setWithdrawalBlockhash] = useState("0");
    const [dailyVolume, setDailyVolume] = useState(0);
    const [connection, setConnection] = useState();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:5887/TableHub')
            .withAutomaticReconnect()
            .build()
        setConnection(newConnection)
        console.log(newConnection)
        return () => { }
    }, [])

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected!')
                    connection.on('UpdateVolume', message => {
                        console.log('message ->', message)
                        setDailyVolume(message);
                    });
                    connection.on('InitClient', blockhash => {
                        setBlockhash(blockhash);
                    });
                    connection.on('WithdrawalNonce', slot => {
                        setWithdrawalBlockhash(slot);
                    });
                    connection.on('WithdrawSuccess', pubKey=>{
                        console.log(pubKey);
                        unityContext.send("Networking Manager", "GetBalance", pubKey);
                    });
                    connection.on('SendErrorToClient', error=>{
                        console.log(error);
                        unityContext.send("Game Manager", "PresentError", error);
                    });
                })
                .catch(e => console.log('Connection failed: ', e))
        }
    }, [connection])
    return (
        <div>
            <Header blockhash={blockhash} ctx={unityContext} withdrawalHash={withdrawalBlockhash} connection={connection} isLoaded={isLoaded} serverStatus={serverStatus}/>
            <div className="space-20"></div>
            <div className="space-20"></div>

            <div className="container-title">
                <div className="container-title-wrapper flex-between">
                    <div> <span className='bold-text'>SOLJACK</span>/ BLACKJACK</div>
                    <div> <span className="bold-text">DAILY VOLUME/</span> <span className='yellow-text'>{dailyVolume}</span></div>
                </div>
            </div>

            <div className="space-20"></div>

            <div className="iframe-container">
                <video src={splashVideo} className="frame-splash" id='frame-splash' autoPlay muted></video>
                <Unity className="responsive-iframe" unityContext={unityContext} />
            </div>

            {/* <Unity unityContext={unityContext} /> */}

            <div className="space-20"></div>

            <div className='tab-container'>
                <div className="tab-container-overlay"></div>
                <Tabs>
                    <TabList>
                        <div className="flex tab-btn-wrapper">
                            <Tab>My bet</Tab>
                            <Tab>All bets</Tab>
                            <Tab>Highrollers</Tab>
                            <Tab>Ranked</Tab>
                            <Tab>DAO leader</Tab>
                        </div>
                    </TabList>

                    <TabPanel> <MyBet connection={connection} isLoaded={isLoaded} /> </TabPanel>
                    <TabPanel> <AllBets connection={connection} isLoaded={isLoaded} /> </TabPanel>
                    <TabPanel> <Highrollers connection={connection} isLoaded={isLoaded}/> </TabPanel>
                    <TabPanel> <MyBet connection={connection} isLoaded={isLoaded}/> </TabPanel>
                    <TabPanel> <AllBets connection={connection} isLoaded={isLoaded}/> </TabPanel>
                </Tabs>

            </div>

            <div className="space-20"></div>
            <div className="space-20"></div>
            <div className="space-20"></div>

            <footer className='flex-between'>
                <div className="flex">
                    <a target='_blank' href='https://www.magiceden.io/marketplace/solhouse'><img src={meIMG} alt="magic-eden" /></a>
                    <div className="space-30"></div>
                    <a target='_blank' href='https://discord.com/invite/m5PbeGqetB'><img src={discordIMG} alt="discord" /></a>
                    <div className="space-30"></div>
                    <a target='_blank' href='https://twitter.com/SOLhouseNFTs'><img src={twitterIMG} alt="twitter" /></a>
                    <div className="space-30"></div>
                    <a target='_blank' href='https://www.instagram.com/solhousenft/'><img src={instagramIMG} alt="instagram" /></a>
                </div>

                <div className="flex">
                    <div className='text-align-right'>
                        <h4>GAMBLING CAN BE ADDICTIVE.</h4>
                        <h4>PLAY RESPONSIBLY.</h4>
                    </div>
                    <img src={phoneIMG} alt="phone" />
                </div>
            </footer>

            {/* <img className='chat-fab' src={chatIMG} alt="chat" /> */}
        </div >
    )
}