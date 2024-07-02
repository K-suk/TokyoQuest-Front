// components/Navbar.js
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link href="/" legacyBehavior>
                    <a className="navbar-brand">Tokyo Quest</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item"><Link href="/" legacyBehavior><a className="nav-link active" aria-current="page">Home</a></Link></li>
                        <li className="nav-item">
                            <Link href="/profile" legacyBehavior>
                                <a className="nav-link">Profile</a>
                            </Link>
                        </li>
                        {/* <li className="nav-item dropdown">
                            <Link href="#" legacyBehavior>
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link href="/" legacyBehavior><a className="dropdown-item">All Products</a></Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link href="/" legacyBehavior><a className="dropdown-item">Popular Items</a></Link></li>
                                <li><Link href="/" legacyBehavior><a className="dropdown-item">New Arrivals</a></Link></li>
                            </ul>
                        </li> */}
                    </ul>
                    {/* <form className="d-flex">
                        <button className="btn btn-outline-dark" type="submit">
                            <i className="bi-cart-fill me-1"></i>
                            Cart
                            <span className="badge bg-dark text-white ms-1 rounded-pill">0</span>
                        </button>
                    </form> */}
                    <ul className="d-flex navbar-nav">
                        <li className="nav-item">
                            <Link href="/change-password" legacyBehavior>
                                <a className="nav-link">Change Password</a>
                            </Link>
                        </li>
                        <li className="nav-item"><LogoutButton /></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;