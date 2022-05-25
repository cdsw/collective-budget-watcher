import React, { useState } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react'
import axios from 'axios';
import { useHistory } from 'react-router';
import moment from 'moment'
import emailjs from 'emailjs-com'
import mk from '../tchot/mk.js'
import sigs from '../tchot/sigs.js'
import { sha256 } from 'js-sha256';
import 'moment-timezone'

import { getID, breakHash, getHash, getSigID } from '../utils.js'

export default function Create() {
    let history = useHistory();
    const [fromTo, setFromTo] = useState('')
    const [amount, setAmount] = useState()
    const [descriptor, setDescriptor] = useState('')
    const [signature, setSignature] = useState('')
    const [valid, setValid] = useState({
        'fromTo' : false,
        'amount' : false,
        'descriptor' : false,
        'signature' : false
    })
    const [tsp, setTsp] = useState(moment())
    const [hashx, setHashx] = useState('')

    const postData = () => {
        // check validity
        setTsp(moment())
        setHashx(getHash(tsp, fromTo, amount, descriptor, signature))
        const hashv = getHash(tsp, fromTo, amount, descriptor, signature)
        if (valid.fromTo && valid.amount && valid.descriptor && valid.signature){
            // Send email here
            sendEmail()
            const timestamp = tsp.tz('Asia/Ho_Chi_Minh').format('MM/DD HH:mm')
            const s256id = getSigID(signature)
            axios.post(mk.mdta, {
                timestamp, fromTo, amount, descriptor, s256id, hashv
            }).then(() => {
                history.push('/read')
            })
        }
    }

    function sendEmail() {
        const s256 = sha256(signature)
        const hashv = getHash(tsp, fromTo, amount, descriptor, signature)
        const params = {
            timestamp: tsp.tz('Asia/Ho_Chi_Minh').format('MM.DD HH:mm:ss'),
            direction: `${getID(fromTo.split('/')[0])} > ${getID(fromTo.split('/')[1])}`,
            amount: amount,
            descriptor: descriptor,
            signature: sigs.cl_sig.includes(s256) ? 'CL' :
                        ( sigs.rw_sig.includes(s256) ? 'RW' : '--'),
            hash: breakHash(hashv),
        }
        emailjs.send(mk.sit, mk.tid, params, mk.yse).then(
            function(response) {console.log('Sent');},
            function(error) {console.log('Error');}
        )
    }
    
    function setFromTo_(value) {
        setFromTo(value)
        setValid({...valid, 'fromTo' : true})
    }

    function setAmount_(value) {
        setValid({...valid, 'amount' : value >= 0})
        setAmount(value)
    }

    function setDescriptor_(value) {
        setDescriptor(value)
        setValid({...valid, 'descriptor' : value.length > 0})
    }

    function setSignature_(value) {
        const v256 = sha256(value)
        setValid({...valid, 'signature' : (sigs.cl_sig.includes(v256) || sigs.rw_sig.includes(v256))})
        setSignature(value)
    }

    function clearData() {
        setFromTo("")
        setAmount("")
        setDescriptor("")
        setSignature("")
        setValid({
            'fromTo' : false,
            'amount' : false,
            'descriptor' : false,
            'signature' : false
            }
        )
    }

    return (
        <div>
            <Form className="create-form">
                <Form.Field>
                    <label>Direction</label>
                    <Radio label={getID(1) + " needs to pay " + getID(0)}
                            checked={fromTo === '0/1'} 
                            name='fromto' 
                            value={getID(0) + "/" + getID(1)} 
                            onClick={() => setFromTo_('0/1')}/>
                    <Radio label={getID(0) + " needs to pay " + getID(1)} 
                            checked={fromTo === '1/0'} 
                            name='fromto' 
                            value={getID(1) + "/" + getID(0)} 
                            onClick={() => setFromTo_('1/0')}/>
                </Form.Field>
                <Form.Field>
                    <label>Amount in 1,000 VND</label>
                    <input placeholder='Amount' 
                            type='number'
                            autoComplete='off'
                            onChange={(e) => setAmount_(e.target.value)}
                            value={amount}/>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <input placeholder='Description' 
                            autoComplete='off'
                            onChange={(e) => setDescriptor_(e.target.value)}
                            value={descriptor}/>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input placeholder='Password'
                            autoComplete='off'
                            type='password'
                            onChange={(e) => setSignature_(e.target.value)}
                            value={signature}/>
                </Form.Field>
                <div>
                    <Button color='blue' onClick={postData} type='submit'>Submit</Button>
                    <Button color='black' onClick={() => clearData()} type='clear'>Clear</Button>
                </div>
                <div className='warning'>
                    <div>{!valid.fromTo ? 'Please select money flow direction.' : null}</div>
                    <div>{!valid.amount ? 'Enter non-negative value only.' : null}</div>
                    <div>{!valid.descriptor ? 'Please add a trx description.' : null}</div>
                    <div>{!valid.signature ? 'Provide a valid password.' : null}</div>
                </div>
            </Form>
            {hashx.slice(0,10)}
        </div>
    )
}