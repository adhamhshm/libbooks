import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {


    const { isAuthenticated, loginWithRedirect: login, logout: auth0Logout, getIdTokenClaims, user } = useAuth0();
    const [roles, setRoles] = useState<string[] | null>(null); 
    
    useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.[`${import.meta.env.VITE_AUTH0_POST_LOGIN_ACTION_API}`] || [];
            setRoles(fetchedRoles);
        };

        fetchRoles();
    }, [isAuthenticated, getIdTokenClaims]);

    const signin = () =>
        login({ authorizationParams: { screen_hint: "login" } });

    const logout = () =>
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <span className='navbar-brand'>Libbooks</span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/home'>Home</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'>Search</NavLink>
                        </li>
                        {isAuthenticated &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
                            </li>
                        }
                        {isAuthenticated &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/fees'>Fees</NavLink>
                            </li>
                        } 
                        {isAuthenticated && roles?.includes(`${import.meta.env.VITE_ROLE_ADMIN}`) &&
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/admin'>Admin</NavLink>
                            </li>
                        }
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {!isAuthenticated ?
                            <li className='nav-item m-1'>
                                <button type='button' className='btn btn-outline-light' onClick={signin}>Sign in</button>
                            </li>
                            :
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle text-light d-flex align-items-center gap-2"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {user?.nickname && user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1)}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                    <button className="dropdown-item" onClick={logout}>
                                        Logout
                                    </button>
                                    </li>
                                </ul>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
