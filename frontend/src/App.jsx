import { useRef, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { ClientContext } from './MyContent';
import Register from './components/userRegistration';
import Main from './components/Main';
import View from './components/View';

function App() {
  const { loggedUserData } = useContext(ClientContext);
  // console.log(loggedUserData);
  const initialState = {
    name: 'Your Name',
    course: 'Your Course',
    dateOfConductStart: '2020-05-20',
    dateOfConductEnd: '2023-05-20',
    signature: '',
    signatureDetails: 'Signature'
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'TEXT_CHANGE':
        return { ...state, [action.field]: action.payload };

      default:
        break;
    }
  };

  const [formState, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Main />}></Route>
        <Route path="/view" element={<View />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
