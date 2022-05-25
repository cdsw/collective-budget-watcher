import './App.css';
import Create from './components/create';
import Read from './components/read';
import { HashRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react'
import mk from './tchot/mk.js'

function App() {
  return (
    <Router>
      <div className="main">
        <div className="main-header">Vietnam 2022<br/>Borrowing/Repayment Flow</div>
        <div className="menu-buttons">
          <a href={mk.plhy}><Button color='yellow'>📅</Button></a>
          <Link to='/read'><Button color='blue'>Trxs List</Button></Link>
          <Link to='/create'><Button color='teal'>New Trx</Button></Link>
        </div>
        
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
