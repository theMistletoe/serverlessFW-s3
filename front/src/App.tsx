import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from "axios";

function App() {
  const [imageBase64, setImageBase64] = useState<string>("");

  useEffect(() => {
    // axios.get(`https://i9twtz4hu6.execute-api.ap-northeast-1.amazonaws.com/dev/hello`)
    axios.get(`http://localhost:3000/dev/hello`)
      .then(res => {
        // console.log(res);
        
        // console.log(res.data.base64);
        setImageBase64('data:image/png;base64,'+res.data.base64)
        // const persons = res.data;
      })
  }, [])

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {

    console.log(e)
    if(! e.target.files) {
      return;
    }

    const params = new FormData();
    params.append('sample_file', e.target.files[0]);

    // const url = 'https://i9twtz4hu6.execute-api.ap-northeast-1.amazonaws.com/dev' + `/test_file_upload`;
    const url = 'http://localhost:3000/dev' + `/test_file_upload`;
    try {
      const res = await axios.post(
        url,
        params,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Encoding': 'identity',
            'content-transfer-encoding': 'binary'
          },
        }
      )
      console.log(res)
      return res.data
    } catch (err) {
      throw err
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <img src={imageBase64}></img>
      <input type="file" onChange={onChangeFile}/>
    </div>
  );
}

export default App;
