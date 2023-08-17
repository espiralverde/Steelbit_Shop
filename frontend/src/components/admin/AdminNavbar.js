import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavbarData } from './NavbarData'
// import { IconContext } from 'react-icons/lib'
import { logout } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Button, Nav } from 'react-bootstrap';

//import "./sidebar.css"

const AdminNavbar = () => {
        const dispatch = useDispatch()
        const [sidebar, setSidebar] = useState(false);
        const showSidebar = () => setSidebar(!sidebar);



    
        return (
        <>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'></li>
                    {NavbarData.map((item, index) => {
                        return (
                            <>
                        <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icons}
                                    <span className='spanTitle'>{item.title}</span>
                                </Link>
                        </li>
                            </>
                        );
                    })}
                <li style={{color: "white"}} className='nav-text'>
                    <a onClick={() => dispatch(logout())}><i class="bi bi-door-closed"></i><span className='spanTitle'>Salir</span></a>
                </li>
                </ul>
            </nav>
        </>
        );
        
    }


export default AdminNavbar

