import React from 'react'

const Pagination: React.FC<{currentPage: number, totalPages: number, paginate: any}> = (props) => {

    const pageNumbers = [];

    // If the current page is the first page (1)
    if (props.currentPage === 1) {
        // Always include the current page
        pageNumbers.push(props.currentPage); // Page 1

        // If there are more pages, include the next page
        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1); // Page 2
        }

        // If even more pages exist, include the one after that
        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2); // Page 3
        }
    } 

    // If the current page is greater than 1 (i.e., not the first page)
    else if (props.currentPage > 1) {
        // If current page is 3 or more, we can safely show two previous pages
        if (props.currentPage >= 3) {
            pageNumbers.push(props.currentPage - 2); // Two pages back
            pageNumbers.push(props.currentPage - 1); // One page back
        } 
        // If current page is 2, only one previous page exists
        else {
            pageNumbers.push(props.currentPage - 1); // One page back (Page 1)
        }

        // Always include the current page
        pageNumbers.push(props.currentPage);

        // Include next page if it exists
        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }

        // Include the page after next if it exists
        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }
    }


    return (
        <nav aria-label="...">
            <ul className='pagination'>
                <li className='page-item' onClick={() => props.paginate(1)}>
                    <button className='page-link'>
                        First Page
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} onClick={() => props.paginate(number)} 
                        className={'page-item ' + (props.currentPage === number ? 'active' : '')}>
                            <button className='page-link'>
                                {number}
                            </button>
                    </li>
                ))}
                <li className='page-item' onClick={() => props.paginate(props.totalPages)}>
                    <button className='page-link'>
                        Last Page
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
