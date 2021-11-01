import React from 'react';
import Project from './projects/components/Project'
import './styles/app.css';
import { Switch, Route} from 'react-router-dom';
import Auth from './users/components/Auth';

function App() {
  return (
    <div>
        <Project />
        <Switch/>
        <Route exact path='/auth' component={Auth}/>
    </div> 
  );
}

export default App;
