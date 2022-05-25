import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import mk from '../tchot/mk.js'
import { Button } from 'semantic-ui-react'
import { parseFromTo, breakHash, calculate } from '../utils.js'

export default function Read() {
    const [APIData, setAPIData] = useState([]);
    const [hashShow, setHashShow] = useState({id: '', hash: ''})
    const [compactView, setCompactView] = useState(false)

    useEffect(() => {
        axios.get(mk.mdta)
            .then((response) => {
                setAPIData(response.data);
            })
    }, []);
    
    function compare(a, b){
        if (parseInt(a.id) > parseInt(b.id)) {
            return -1
        } if (parseInt(a.id) > parseInt(b.id)) {
            return 1
        } return 0
    }

    function showHash(id, hash) {
        setHashShow({id: id, hash: hash})
    }

    const debts = calculate(APIData)

    function switchView() {
        setCompactView(!compactView)
    }

    return ( 
        <div className='container'>
            <div className='summary-header'>
                <div>
                    <div className='big'>Current standing:</div>
                    {debts[0] > debts[1] ? 
                        <div className='pay-cl'>CL needs to pay RW 
                            <div>
                                VNĐ 
                                <span> {Intl.NumberFormat('fr-FR').format(debts[0])}</span>
                            </div>
                        </div> :
                        ( debts[1] > 0 ? 
                            <div className='pay-rw'>RW needs to pay CL  
                                <div>
                                    VNĐ 
                                    <span> {Intl.NumberFormat('fr-FR').format(debts[1])}</span>
                                </div>
                            </div> : 
                            <div>No debt present</div>
                    )}
                </div>
                <Button color={compactView ? 'teal' : 'red'} 
                        style={{justifySelf: 'right'}}
                        onClick={switchView}>
                            {compactView ? 'Fancy' : 'Compact'}
                </Button>
            </div>
            
            {compactView ? (
                <table>
                    <tr className='tab-head'>
                        <th>#</th>
                        <th>Time</th>
                        <th>Dir.</th>
                        <th>VNDk</th>
                        <th>Description</th>
                        <th>Sig.</th>
                    </tr>

                    {APIData.sort(compare).map((data) => {
                        return (
                            <Fragment>
                                <tr className={'data-row'} onClick={() => showHash(data.id, data.hashv)}>
                                    <td className='tab-amt'>{data.id}</td>
                                    <td className='tab-id'>{data.timestamp}</td>
                                    <td className='tab-id'>{parseFromTo(data.fromTo)}</td>
                                    <td className='tab-amt'>{Math.floor(data.amount / 1000)}</td>
                                    <td className='tab-con'>{data.descriptor}</td>
                                    <td className='tab-id' >{data.s256id}</td>
                                </tr>
                                { data.id === hashShow.id ?
                                    <tr>
                                        <td colSpan="6" className="hash-show">
                                            {`^ Hash: ${breakHash(hashShow.hash)}`}
                                        </td>
                                    </tr> : null
                                }
                            </Fragment>
                        )
                    })}
                </table>
            ) : (
                <div className='card-container'>
                    {APIData.sort(compare).map((data) => {
                        return (
                            <div className='card'>
                                <div className='card-header'>
                                    Trx# <span className='card-id'>{data.id}</span>
                                    <span className='card-date'>{parseFromTo(data.fromTo)}</span>
                                    <span className='card-date'>
                                        {data.timestamp}
                                        <span className={data.s256id === 'CL' ? 'text-cl' : 'text-rw'}> {data.s256id}</span>
                                    </span>
                                </div>
                                <div className='card-body'>
                                    <div className='card-description'>{data.descriptor}</div>
                                    <div className='card-amount-container'>
                                        <div>VNĐ</div>
                                        <div className='card-amount'>
                                            {Intl.NumberFormat('fr-FR').format(data.amount)}
                                        </div>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <span className='card-sig'>
                                        {breakHash(data.hashv)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
