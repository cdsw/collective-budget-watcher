import React, { useState } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react'
import axios from 'axios';
import { useHistory } from 'react-router';
import moment from 'moment'
import emailjs from 'emailjs-com'
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

    console.log(amount)
    const postData = () => {
        // check validity
        if (valid.fromTo && valid.amount && valid.descriptor && valid.signature){
            // Send email here
            //sendEmail() OPEN ONLY ON JUL 15
            const timestamp = moment().format('YYYY.MM.DD HH:mm:ss')
            axios.post(mk.mdta, {
                timestamp, fromTo, amount, descriptor, signature
            }).then(() => {
                history.push('/read')
            })
        }
    }

    function sendEmail() {
        const params = {
            timestamp: moment().format('MM.DD HH:mm'),
            direction: fromTo,
            amount: amount,
            descriptor: descriptor,
            signature: signature
        }
        console.log(mk.sit, mk.tid)
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
        setValid({...valid, 'amount' : value > 0})
        setAmount(value)
    }

    function setDescriptor_(value) {
        setDescriptor(value)
        setValid({...valid, 'descriptor' : value.length > 1})
    }

    function setSignature_(value) {
        setValid({...valid, 'signature' : (sigs.cl_sig.includes(value) || sigs.rw_sig.includes(value))})
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
                    <label>From ~ To</label>
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
                            onChange={(e) => setAmount_(e.target.value)}
                            value={amount}/>
                </Form.Field>
                <Form.Field>
                    <label>Descriptor</label>
                    <input placeholder='Description' 
                            onChange={(e) => setDescriptor_(e.target.value)}
                            value={descriptor}/>
                </Form.Field>
                <Form.Field>
                    <label>Signature</label>
                    <input placeholder='Signature'
                            type='password' 
                            onChange={(e) => setSignature_(e.target.value)}
                            value={signature}/>
                </Form.Field>
                <div>
                    <Button onClick={postData} type='submit'>Submit</Button>
                    <Button onClick={() => clearData()} type='clear'>Clear</Button>
                </div>
                <div className='warning'>
                    <div>{!valid.fromTo ? 'Please select money flow direction.' : null}</div>
                    <div>{!valid.amount ? 'Enter value only.' : null}</div>
                    <div>{!valid.descriptor ? 'Please add a trx description.' : null}</div>
                    <div>{!valid.signature ? 'Provide a valid signature.' : null}</div>
                </div>
            </Form>
        </div>
    )
}
