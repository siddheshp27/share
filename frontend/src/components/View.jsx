import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './Nav';
const View = () => {
  const [img, setImg] = useState('');

  const Img = ({ src }) => {
    return (
      <li>
        <a href="#" className="block overflow-hidden group">
          <img
            src={`data:image/jpeg;base64,${src}`}
            alt=""
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />
        </a>
      </li>
    );
  };

  useEffect(() => {
    const get = async () => {
      const user = localStorage.getItem('user');
      console.log(user);
      const res = await axios.post('http://localhost:3000/user/getCid', { user });
      console.log(res.data);
      const imgs = res.data;
      const data = imgs.map((e) => <Img src={e} />);
      setImg(data);
    };
    get();
  }, []);
  return (
    <section>
      <Nav />
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-500 sm:text-3xl">Image Collection</h2>

          <p className="max-w-md mt-4 text-gray-500">All The Images will be Displayed Here</p>
        </header>

        <ul className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">{img}</ul>
      </div>
    </section>
  );
};

export default View;
