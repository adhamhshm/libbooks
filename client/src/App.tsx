import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './layouts/HomePage/HomePage'
import Footer from './layouts/NavbarAndFooter/Footer'
import Navbar from './layouts/NavbarAndFooter/Navbar'
import SearchBooksPage from './layouts/SearchBooksPage/SearchBooksPage'
import BookCheckoutPage from './layouts/BookCheckoutPage/BookCheckoutPage'
import LoginPage from './auth/LoginPage'
import ReviewListPage from './layouts/ReviewListPage/ReviewListPage'
import ShelfPage from './layouts/ShelfPage/ShelfPage'
import MessagesPage from './layouts/MessagesPage/MessagesPage'
import ManageLibraryPage from './layouts/ManageLibraryPage/ManageLibraryPage'
import { useAuth0 } from '@auth0/auth0-react'
import SpinnerLoading from './layouts/Utils/SpinnerLoading'
import PaymentPage from './layouts/PaymentPage/PaymentPage'

const App = () => {

    // Loading state, the SDK needs to reach Auth0 on load
    const { isLoading } = useAuth0();

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    };

    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar />
            <div className='flex-grow-1'>
                <Routes>
                    <Route path='/' element={<Navigate to="/home" replace />} />
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/search' element={<SearchBooksPage />} />
                    <Route path='/checkout/:bookId' element={<BookCheckoutPage />} />
                    <Route path='/reviewlist/:bookId' element={<ReviewListPage />} />
                    <Route path='/messages' element={<MessagesPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/admin' element={<ManageLibraryPage />} />
                    <Route path='/shelf' element={<ShelfPage />} />
                    <Route path='/fees' element={<PaymentPage />} />
                    <Route path='*' element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
