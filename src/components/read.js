import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import mk from '../tchot/mk.js'
import sigs from '../tchot/sigs.js'

function getID(num){
    switch(num){
        case 0:
            return 'CL'
        case 1:
            return 'RW'
        default:
            return ''
    }
}

function parseFromTo(fromTo) {
    switch(fromTo) {
        case '0/1':
            return 'RW > CL'
        case '1/0':
            return 'CL > RW'
    }
}

function calculate(alldata) {
    var cl2r = 0
    var r2cl = 0
    for (let i = 0; i < alldata.length; i++) {
        const amt = parseFloat(alldata[i].amount)
        if (alldata[i].fromTo[0] == '0') {
            r2cl += amt
        } else if (alldata[i].fromTo[0] == '1') {
            cl2r += amt
        }
    }

    if (cl2r > r2cl) {
        cl2r -= r2cl
        r2cl = 0
    } else if (r2cl > cl2r) {
        r2cl -= cl2r
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

    const setData = (data) => {
        let { id, timestamp, fromTo, amount, descriptor, signature } = data;
        localStorage.setItem('ID', id);
        localStorage.setItem('Time', timestamp);
        localStorage.setItem('Direction', fromTo);
        localStorage.setItem('Amount', amount);
        localStorage.setItem('Description', descriptor)
        localStorage.setItem('Signature', signature)
    }

    const getData = () => {
        axios.get(mk.mdta)
            .then((getData) => {
                setAPIData(getData.data);
            })
    }

    const onDelete = (id) => {
        axios.delete(`${mk.mdta}/${id}`)
        .then(() => {
            getData();
        })
    }

    function compare(a, b){
        if (a.id > b.id) {
            return -1
        } if (a.id < b.id) {
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
                    <th>ID</th>
                    <th>Time</th>
                    <th>Dir.</th>
                    <th>VNDk</th>
                    <th>Description</th>
                    <th>Sig.</th>
                </tr>

                {APIData.sort(compare).map((data) => {
                    return (
                        <tr>
                            <td className='tab-id'>{data.id}</td>
                            <td className='tab-id'>{data.timestamp}</td>
                            <td className='tab-id'>{parseFromTo(data.fromTo)}</td>
                            <td className='tab-amt'>{data.amount}</td>
                            <td className='tab-con'>{data.descriptor}</td>
                            <td className='tab-con'>{
                                sigs.cl_sig.includes(data.signature) ? 'CL' :
                                ( sigs.rw_sig.includes(data.signature) ? 'RW' : '--')
                            }</td>

                        </tr>
                    )
                })}
            </table>
        </div>
    )
}
