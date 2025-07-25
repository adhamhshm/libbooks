import { useEffect, useState } from "react";
import type BookModel from "../../models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import StarsReview from "../Utils/StarsReview";
import CheckoutAndReviewBox from "./components/CheckoutAndReviewBox";
import type ReviewModel from "../../models/ReviewModel";
import LatestReviews from "./components/LatestReviews";
import { useAuth0 } from "@auth0/auth0-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

const BookCheckoutPage = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Get Book Id from the URL
    const bookId = (window.location.pathname).split('/')[2];

    // Fetch Book Details
    useEffect(() => {
        // Initialize the fetching books function
        const fetchBook = async () => {

            const url = `${import.meta.env.VITE_REACT_API_APP}/books/${bookId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong. Unable to fetch the book.');
            };

            const responseJson = await response.json();
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };

        // Call the fetching books function and handle loading state and errors
        fetchBook().then(() => {
            setIsLoading(false);
        }).catch((error) => {
            setHttpError(error.message);
            setIsLoading(false);
        });

    }, [isCheckedOut, bookId, getAccessTokenSilently]);

    // Fetch Book Reviews
    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${import.meta.env.VITE_REACT_API_APP}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong. Unable to fetch book reviews.');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchBookReviews().then(() => {
            setIsLoadingReview(false);
        }).catch((error) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        });
    }, [isReviewLeft, bookId]);

    // Fetch User Review
    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (isAuthenticated) {
                // const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_REACT_API_APP}/reviews/secure/user/book?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong. Unable to fetch user review.');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [bookId, isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_REACT_API_APP}/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                     }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok)  {
                    throw new Error('Something went wrong. Unable to fetch current loans count.');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut, isAuthenticated, getAccessTokenSilently]);

    // Check if user has checked out the book
    useEffect(() => {
        const checkIsUserCheckedOutBook = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_REACT_API_APP}/books/secure/ischeckedout/byuser?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong. Unable to check if book is checked out.');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        checkIsUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [bookId, isAuthenticated, getAccessTokenSilently]);

    // Handle loading state
    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading/>
        )
    };

    // Handle error state
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    // Function to handle book checkout
    async function checkoutBook() {
        // const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;
        const accessToken = await getAccessTokenSilently();
        const url = `${import.meta.env.VITE_REACT_API_APP}/books/secure/checkout?bookId=${book?.id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong. Unable to checkout book');
        }
        setIsCheckedOut(true);
    }

    // Function to submit review
    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `${import.meta.env.VITE_REACT_API_APP}/reviews/secure`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong! Unable to submit review.');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img 
                                src={book?.img} 
                                width='226' 
                                height='349' 
                                alt='Book' 
                            />
                            :
                            <img 
                                src='/images/BooksImages/book-luv2code-1000.png'
                                width='226'
                                height='349' alt='Book' 
                            />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox 
                        book={book} 
                        mobile={false} 
                        currentLoansCount={currentLoansCount} 
                        isAuthenticated={isAuthenticated} 
                        isCheckedOut={isCheckedOut} 
                        checkoutBook={checkoutBook} 
                        isReviewLeft={isReviewLeft} 
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img 
                            src={book?.img} 
                            width='226' 
                            height='349' 
                            alt='Book'
                        />
                        :
                        <img src='/images/BooksImages/book-luv2code-1000.png'
                            width='226'
                            height='349' 
                            alt='Book' 
                        />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox 
                    book={book} 
                    mobile={true} 
                    currentLoansCount={currentLoansCount} 
                    isAuthenticated={isAuthenticated} 
                    isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} 
                    isReviewLeft={isReviewLeft} 
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}

export default BookCheckoutPage;
