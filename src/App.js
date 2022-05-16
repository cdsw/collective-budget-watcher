import './App.css';
import Create from './components/create';
import Read from './components/read';
import { HashRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'
import { useState } from 'react';
import sigs from './tchot/sigs.js'
import mk from './tchot/mk.js'

function App() {
  const [planFlap, setPlanFlap] = useState(false)
  const [signature, setSignature] = useState('')
  const [approved, setApproved] = useState(false)

  function openPlan(){
    setPlanFlap(!planFlap)
  }

  function authorize(){
    setApproved(sigs.cl_sig.includes(signature) || sigs.rw_sig.includes(signature))
  }
  
  return (
    <Router>
      <div className="main">
        <div className="main-header">Vietnam 2022<br/>Borrowing/Repayment Flow</div>
        <div className="menu-buttons">
          <Button color='orange' onClick={openPlan}>Open Plan</Button>
          <Link to='/read'><Button color='blue'>List of Trxs</Button></Link>
          <Link to='/create'><Button color='teal'>Create A New Trx</Button></Link>
        </div>
        {planFlap ?
          <div className='popup-sign'>
            <Form>
              <Form.Field>
                <input placeholder='Signature'
                        autoComplete='off'
                        type='password'
                        onChange={(e) => setSignature(e.target.value)}
                        value={signature}/>
              </Form.Field>
            </Form>
            {!approved ? 
              <Button color='orange' onClick={authorize}>Authorize</Button> : 
              <div><a href={mk.plhy}><Button color='green' onClick={authorize}>Authorize</Button></a></div>
            }
          </div>
        : null}
        
        <div>
          <Route exact path='/create' component={Create} />
        </div>
        <div style={{ marginTop: 20 }}>
          <Route exact path='/read' component={Read} />
        </div>
        <div style={{ marginTop: 20 }}>
          <Route exact path='/' component={Read} />
        </div>

        {/* <Route path='/update' component={Update} />  */}
      </div>
    </Router>
  );
}

export default App;
