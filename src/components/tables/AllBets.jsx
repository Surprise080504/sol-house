import React, { useEffect, useState } from "react"
import { TableRow } from "./TableRow"

export const AllBets = (props) => {
    const [bets, setBets] = useState([])

    useEffect(() => {
        // get data
        console.log(props.isLoaded);
        setBets([
            {
                'game': "CRASH",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "PUSH",
                "payout": 0.3
            },
            {
                'game': "DICE",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "WIN",
                "payout": 0.3
            },
            {
                'game': "BLACKJACK",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "BLACKJACK",
                "payout": 0.3
            },
            {
                'game': "BLACKJACK",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "BLACKJACK",
                "payout": 0.3
            },
            {
                'game': "CRASH",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "PUSH",
                "payout": 0.3
            },
            {
                'game': "DICE",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "WIN",
                "payout": 0.3
            },
            {
                'game': "BLACKJACK",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "BLACKJACK",
                "payout": 0.3
            },
            {
                'game': "CRASH",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "PUSH",
                "payout": 0.3
            },
            {
                'game': "DICE",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "WIN",
                "payout": 0.3
            },
            {
                'game': "BLACKJACK",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "BLACKJACK",
                "payout": 0.3
            },
            {
                'game': "CRASH",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "PUSH",
                "payout": 0.3
            },
            {
                'game': "DICE",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "WIN",
                "payout": 0.3
            },
            {
                'game': "BLACKJACK",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "BLACKJACK",
                "payout": 0.3
            },
            {
                'game': "CRASH",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "PUSH",
                "payout": 0.3
            },
            {
                'game': "DICE",
                "wallet": "Wallet (...4cud)",
                "bet": 0.5,
                "result": "WIN",
                "payout": 0.3
            },
        ])

        return () => {
            setBets([])
        }
    }, [])

    return (
        <div className="table-wrapper">
            <table>
                <tr className='table-header'>
                    <th>GAME</th>
                    <th>USER</th>
                    <th>BET</th>
                    <th>RESULT</th>
                    <th>PAYOUT</th>
                </tr>
                <div className="space-30"></div>
                <div className="space-30"></div>

                {
                    bets.map(bet => {
                        return <TableRow game={bet.game} user={bet.wallet} bet={bet.bet} result={bet.result} payout={bet.payout} />
                    })
                }

            </table>
        </div>
    );
}