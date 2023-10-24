import React, { useState } from 'react';
import axios from 'axios';
import Nav from './Nav';

const Main = () => {
  const [base64String, setBase64String] = useState('');
  const handleFileInputChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        console.log(base64);
        setBase64String(base64);
      };

      reader.readAsDataURL(file); // This line is missing in your code
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(base64String);
    const user = localStorage.getItem('user');
    const leadgerResponse = await axios.post('http://localhost:3000/user/putCid', { user, bin: base64String });
    console.log(leadgerResponse);
  };

  return (
    <div className="h-screen">
      <Nav />
      <div className="text mb-[15%]">
        <h1 className="text-center pt-16 text-4xl font-bold tracking-tight leading-none text-white md:text-5xl lg:text-4xl dark:text-white text-up ">
          WEB3 Decentralised Storage Solutions
        </h1>
      </div>

      <div className="flex items-center justify-center ">
        <form onSubmit={handleSubmit} className="w-8/12 flex items-center justify-center flex-col">
          <input
            type="file"
            id="inp"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            accept=".jpg, .jpeg, .png, .gif, .pdf"
            onChange={handleFileInputChange}
          />
          <button className="m-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-10 py-3.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Main;
