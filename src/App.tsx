//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Component
import UserList from './component/UserList';
import UserDetails from './component/UserDetails';
import UserForm from './component/UseForm';
import Navbar from "./component/Navbar";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Navbar />
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/users" replace />}/>
              <Route path="/users" element={<UserList />}/>
              <Route path="/users/:id" element={<UserDetails />}/>
              <Route path="/add-user" element={<UserForm />}/>
              <Route path="/edit-user/:id" element={<UserForm />}/>
              <Route path="*" element={<Navigate to="/users" replace/>}/>
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
    
  );
};

export default App;
