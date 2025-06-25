import React from 'react';
import { NavLink } from 'react-router';
import './Menu.scss';

export default function Menu() {

  const routes = [
    {
      path: '/',
      title: 'Home',
    },
    {
      path: '/my-crypto',
      title: 'My Crypto',
    },
    {
      path: '/crypto',
      title: 'Crypto',
    },
      {
      path: '/crypto/:id',
      title: 'Details',
    },
       {
      path: '/admin',
      title: 'Admin',
    },

  ]
  return (
    <nav className="menu">
      <ul className='menu__list'>
        {routes.map((item, index) => (
          <li className='menu__list-item' key={index}>
            <NavLink 
              to={item.path}>{item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
