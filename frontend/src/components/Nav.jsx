import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Upload', href: '/' },
  { name: 'View', href: '/view' }
];
export default function Nav() {
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/login');
    else setUser(localStorage.getItem('user'));
  }, []);
  return (
    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        {/* <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <img className="h-8 w-auto" src="" alt="" />
        </a> */}
      </div>
      <div className="flex lg:hidden">
        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
            {item.name}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <Link to="/login" className="text-sm font-semibold leading-6 text-white">
          {user}
          {/* <span aria-hidden="true">&rarr;</span> */}
        </Link>
      </div>
    </nav>
  );
}
