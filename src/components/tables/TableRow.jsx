import React from "react";
import cardIMG from '../../assets/card.png'
import diceIMG from '../../assets/dice.png'
import crashIMG from '../../assets/crash.png'
import solanaIMG from '../../assets/solana.png'

export const TableRow = (props) => {
    return (
        <tr>
            <td>
                {props.game === 'BLACKJACK' ? <img src={cardIMG} alt="" /> : null}
                {props.game === 'CRASH' ? <img src={crashIMG} alt="" /> : null}
                {props.game === 'DICE' ? <img src={diceIMG} alt="" /> : null}

                {props.game}
            </td>

            <td>{props.user}</td>

            <td className='bet-value'>
                {props.bet}
                <img src={solanaIMG} alt="solana" />
            </td>

            <td>
                {
                    props.result === 'LOSE' || props.result === 'PUSH' ?
                        <span className='medium-text'>{props.result}</span>
                        : null
                }

                {
                    props.result === 'BLACKJACK' ?
                        <span className='neutral-text heavy-text'>{props.result}</span>
                        : null
                }

                {
                    props.result === 'WIN' ?
                        <span className='heavy-text win'>{props.result}</span>
                        : null
                }
            </td>

            <td >
                {
                    props.payout === 'N/A' ?
                        <span className='bet-value medium-text'>{props.payout}</span>
                        : null
                }

                {
                    props.payout !== 'N/A' ?
                        <span className='bet-value'>{props.payout}</span>
                        : null
                }

                <img src={solanaIMG} alt="solana" />
            </td>
        </tr >
    )
}