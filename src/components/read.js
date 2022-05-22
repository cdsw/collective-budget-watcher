import axios from 'axios';
import React, { useEffect, useState } from 'react';
import mk from '../tchot/mk.js'

function parseFromTo(fromTo) {
    switch(fromTo) {
        case '0/1':
            return 'RW > CL'
        case '1/0':
            return 'CL > RW'
        default:
            return ''
    }
}

function calculate(alldata) {
    var cl2r = 0
    var r2cl = 0
    for (let i = 0; i < alldata.length; i++) {
        const amt = parseFloat(alldata[i].amount)
        if (alldata[i].fromTo[0] === '0') {
            r2cl += amt
        } else if (alldata[i].fromTo[0] === '1') {
            cl2r += amt
        }
    }

    if (cl2r > r2cl) {
        cl2r -= r2cl
        r2cl = 0
    } else if (r2cl > cl2r) {
        r2cl -= cl2r
        cl2r = 0
    } else if (cl2r === r2cl) {
        r2cl = 0
        cl2r = 0
    }
    return [cl2r, r2cl]
}

export default function Read() {
    const [APIData, setAPIData] = useState([]);
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

    const debts = calculate(APIData)

    return ( 
        <div className='container'>
            <div className='big'>Current standing:</div>
            {debts[0] > debts[1] ? 
                <div className='pay-cl'>CL needs to pay RW <span>VND {debts[0]}k</span></div> :
                ( debts[1] > 0 ? 
                    <div className='pay-rw'>RW needs to pay CL <span>VND {debts[1]}k</span></div> : 
                    <div>No debt present</div>
                )
            }
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
                        <tr>
                            <td className='tab-amt'>{data.id}</td>
                            <td className='tab-id'>{data.timestamp}</td>
                            <td className='tab-id'>{parseFromTo(data.fromTo)}</td>
                            <td className='tab-amt'>{data.amount}</td>
                            <td className='tab-con'>{data.descriptor}</td>
                            <td className='tab-id'>{data.s256id}</td>

                        </tr>
                    )
                })}
            </table>
        </div>
    )
}
