import React, { useState, useEffect } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react'
import axios from 'axios';
import { useHistory } from 'react-router';
import mk from '../tchot/mk.js'

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

export default function Update() {
    let history = useHistory();
    const [id, setId] = useState('')
    const [fromTo, setFromTo] = useState('')
    const [timestamp, setTimestamp] = useState('')
    const [amount, setAmount] = useState()
    const [descriptor, setDescriptor] = useState('')
    const [signature, setSignature] = useState('')
    const [valid, setValid] = useState({
        'fromTo' : true,
        'amount' : true,
        'descriptor' : true,
        'signature' : true
    })

    useEffect(() => {
        setId(localStorage.getItem('ID'))
        setFromTo(localStorage.getItem('Direction'))
        setTimestamp(localStorage.getItem('Time'))
        setAmount(localStorage.getItem('Amount'));
        setDescriptor(localStorage.getItem('Description'));
    }, []);

    const updateAPIData = () => {
        axios.put(`${mk.mdta}/${id}`, {
            timestamp, fromTo, amount, descriptor, signature
        }).then(() => {
            history.push('/read')
        })
    }
    function setFromTo_(value) {
        setFromTo(value)
        setValid({...valid, 'fromTo' : true})
    }

    function setAmount_(value) {
        if (!isNaN(value)) {
            setAmount(value)
            setValid({...valid, 'amount' : true})
        } else {
            setValid({...valid, 'amount' : false})
        }
    }

    function setDescriptor_(value) {
        setDescriptor(value)
    }

    return (
        <div>
            <Form className="create-form">
                <Form.Field>
                    <label>From ~ To</label>
                    <Radio label={getID(0) + " pays for " + getID(1)}
                            checked={fromTo === '0/1'} 
                            name='fromto' 
                            value={getID(0) + "/" + getID(1)} 
                            onClick={() => setFromTo_('0/1')}/>
                    <Radio label={getID(1) + " pays for " + getID(0)} 
                            checked={fromTo === '1/0'} 
                            name='fromto' 
                            value={getID(1) + "/" + getID(0)} 
                            onClick={() => setFromTo_('1/0')}/>
                </Form.Field>
                <Form.Field>
                    <label>Amount in 1,000 VND</label>
                    <input placeholder='Amount' 
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
                            onChange={(e) => setSignature(e.target.value)}
                            value={signature}/>
                </Form.Field>
                <Button onClick={updateAPIData} type='submit'>Update</Button>
            </Form>
        </div>
    )
}
