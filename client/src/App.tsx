import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './layouts/HomePage/HomePage'
import Footer from './layouts/NavbarAndFooter/Footer'
import Navbar from './layouts/NavbarAndFooter/Navbar'
import SearchBooksPage from './layouts/SearchBooksPage/SearchBooksPage'

const App = () => {

    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar />
            <div className='flex-grow-1'>
                <Routes>
                <Route path='/' element={<Navigate to="/home" replace />} />
                <Route path='/home' element={<HomePage />} />
                <Route path='/search' element={<SearchBooksPage />} />
            </Routes>
            </div>
            <Footer />
        </div>
    )
}

export default App;
