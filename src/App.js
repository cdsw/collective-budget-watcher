import './App.css';
import Create from './components/create';
import Read from './components/read';
import Update from './components/update';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { useHistory } from 'react-router';

function App() {
  let history = useHistory();
  return (
    <Router>
      <div className="main">
        <div className="main-header">Vietnam 2022<br/>Borrowing/Repayment Flow</div>
        <div>
          <a href='/read'><Button>List of Trxs</Button></a>
          <a href='/create'><Button>Create A New Trx</Button></a>
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
