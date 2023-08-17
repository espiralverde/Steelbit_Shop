import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from "./redux/store"

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  //con esto le doy acceso al "store" a toda la aplicación
  <Provider store={store}> 
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
