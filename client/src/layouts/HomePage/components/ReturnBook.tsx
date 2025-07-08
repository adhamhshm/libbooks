import React from 'react'

const ReturnBook = () => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                    <img
                        src='/images/BooksImages/book-luv2code-1000.png'
                        width='151'
                        height='233'
                        alt="book"
                    />
                <h6 className='mt-2'>Title</h6>
                <p>Author</p>
                <a className='btn main-color text-white'>Reserve</a>
            </div>
        </div>
    );
}

export default ReturnBook;
