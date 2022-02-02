import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import solanaIMG from '../assets/solana.png'
import Logo from '../assets/logo.png'
import walletIMG from '../assets/wallet.png'
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: 'transparent'
    }
}

Modal.setAppElement('#root');

const Header = (props) => {
    let navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [connected, setConnected] = useState(false)

    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawalAmount, setWithdrawalAmount] = useState('')

    const location = window.location.pathname

    const isActiveNav = (routeName) => {
        if (routeName === location) return true
        return false
    }
    const connect = async () => {
        if (props.blockhash === 0 || !props.isLoaded)return;
        const {Buffer} = require("buffer");
        const bs58 = require('bs58');
        const web3 = require('@solana/web3.js');
        try{
            await window.solana.connect()
        }catch{
            console.log("failed to connect");
            return;
        }

        const message = "Sign in with a one time nonce "+ props.blockhash;
        const encodedMessage = new TextEncoder().encode(message);
        let data = Buffer.from(message).toString("base64");
        try{
            let signature = await window.solana.signMessage(encodedMessage, "utf8")
            console.log(bs58.encode(signature.signature));
            console.log(data);
            console.log(props);
            props.ctx.send("Game Manager", "SetSignature", bs58.encode(signature.signature).toString());
            props.ctx.send("Game Manager", "SetTransaction", data);
            props.ctx.send("Game Manager", "SetPublicKey", window.solana.publicKey.toString());
            props.ctx.send("Game Manager", "SetBlockhash", props.blockhash);
            setConnected(!connected)
        }catch(ex)
        {
            console.log("failed ", ex);
            return;
        }
    }

    const wallet = () => {
        setConnected(!connected)
    }
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }
    const confirmWithdrawal = async () => {
               
        try{
            await window.solana.connect()
        }catch{
            console.log("failed to connect");
            return;
        }
        const clientPubKey = window.solana.publicKey;
        //props.connection.invoke("RequestWithdrawal", clientPubKey.toString());

        const {Buffer} = require("buffer");
        const bs58 = require('bs58');
        const web3 = require('@solana/web3.js');
        const message = "Sign a one time withdrawal nonce "+ props.blockhash;
        const encodedMessage = new TextEncoder().encode(message);
        let data = Buffer.from(message).toString("base64");
        try{
            let signature = await window.solana.signMessage(encodedMessage, "utf8")
            console.log(bs58.encode(signature.signature));
            console.log(data);
            props.connection.invoke("WithdrawMoney", clientPubKey.toString(), bs58.encode(signature.signature).toString(), data,props.blockhash, parseFloat(withdrawalAmount));
            closeModal();
        }catch{
            props.ctx.send("Game Manager", "PresentError", "Failed to withdraw - funds won't be lost!");
            closeModal();
        }
    }
    const confirmDeposit = async () => {
        if(props.serverStatus === "Down"){
            props.ctx.send("Game Manager", "PresentError", "Server is currently down, your deposit won't be registered!");
            closeModal();
            return;
        }
        try{
            await window.solana.connect()
        }catch{
            console.log("failed to connect");
            return;
        }
        const serverAddress = "BuTSghSXXhgNYvwu1n8qmebqBoNtzTeVtcsa48ivF9Z6";
        const solanaWeb3 = require('@solana/web3.js');
        const connection = new solanaWeb3.Connection("https://solana-mainnet.phantom.tech", 'confirmed');
        const slot = await connection.getSlot();
        const blockTime = await connection.getBlockTime(slot);
        const block = await connection.getBlock(slot);
        const clientPubKey = window.solana.publicKey;
        var transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: clientPubKey,
                toPubkey: new solanaWeb3.PublicKey(serverAddress),
                lamports: solanaWeb3.LAMPORTS_PER_SOL * depositAmount
            }),
        );
        transaction.feePayer =clientPubKey;
        transaction.recentBlockhash = block.blockhash;
        try{
            let signedTx = await window.solana.signTransaction(transaction);
            let signature = await solanaWeb3.sendAndConfirmRawTransaction(connection, signedTx.serialize());
            const payload =signedTx.serializeMessage().toString('base64');
            props.connection.invoke("DepositMoney", clientPubKey.toString(), signature.toString(), payload, parseFloat(depositAmount));
            closeModal();
            props.ctx.send("Networking Manager", "GetBalance", clientPubKey.toString());
        }catch
        {
            closeModal();
            props.ctx.send("Game Manager", "PresentError", "Failed to deposit - funds won't be lost!");
        }
    }

    function closeModal() {
        // close modal
        setIsOpen(false);
    }
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="">

                <div className='modal'>
                    <Tabs>
                        <TabList>
                            <div className="flex tab-btn-wrapper">
                                <Tab>DEPOSIT</Tab>
                                <Tab>WITHDRAWAL</Tab>
                            </div>
                        </TabList>

                        <TabPanel>
                            <div className="modal-tab text-align-center">
                                <h1 className='neutral-text'>DEPOSIT AMOUNT</h1>
                                <h3>PLEASE INSERT THE AMOUNT YOU WOULD LIKE TO DEPOSIT</h3>
                                <div className="space-30"></div>
                                <div className="input-container">
                                    <input type="text" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                                    <img src={solanaIMG} />
                                    <div className="input-container-btn">MAX</div>
                                </div>
                                <div className="space-30"></div>

                                <div className='modal-btn-border' onClick={confirmDeposit}>
                                    <div className="modal-btn">CONFIRM</div>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div className="modal-tab text-align-center">
                                <h1 className='neutral-text'>WITHDRAWAL AMOUNT</h1>
                                <h3>PLEASE INSERT THE AMOUNT YOU WOULD LIKE TO WITHDRAW</h3>
                                <div className="space-30"></div>

                                <div className="input-container">
                                    <input value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} />
                                    <img src={solanaIMG} />
                                    <div className="input-container-btn">MAX</div>
                                </div>

                                <div className="space-30"></div>

                                <div className='modal-btn-border'>
                                    <div onClick={confirmWithdrawal} className="modal-btn">CONFIRM</div>
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>

            </Modal>

            <header>
                <div className="header-wrapper">

                    <div className="menu-btn">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="space-30"></div>
                    <div className="space-30"></div>

                    <img className='logo' src={Logo} />

                    <div className='flex nav'>
                        <div onClick={() => navigate('/')} className={isActiveNav('/') ? 'active' : ''}>HOME</div>
                        <div onClick={() => navigate('/about')} className={isActiveNav('/about') ? 'active' : ''}>ABOUT</div>
                        <div onClick={() => navigate('/games')} className={isActiveNav('/games') ? 'active' : ''}>GAMES</div>
                        <div onClick={() => navigate('/leaderboard')} className={isActiveNav('/leaderboard') ? 'active' : ''}>LEADERBOARD</div>
                        <div onClick={() => navigate('/nfts')} className={isActiveNav('/nfts') ? 'active' : ''}>NFTS</div>
                        <div onClick={() => navigate('/faq')} className={isActiveNav('/faq') ? 'active' : ''}>FAQ</div>
                    </div>

                    <div style={{ width: '150px' }}>
                        <div className='flex'>
                            {
                                connected ?
                                    <div className="btn" onClick={openModal}>
                                        Wallet
                                        <img src={walletIMG} alt="wallet" />
                                    </div>
                                    : <div className="btn" onClick={connect}>
                                        Connect
                                        <img src={walletIMG} alt="wallet" />
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header