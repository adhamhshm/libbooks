import { useEffect, useState } from "react";
import type BookModel from "../../models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import StarsReview from "../Utils/StarsReview";
import CheckoutAndReviewBox from "./components/CheckoutAndReviewBox";
import type ReviewModel from "../../models/ReviewModel";
import LatestReviews from "./components/LatestReviews";

const BookCheckoutPage = () => {

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

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {

        // Initialize the fetching books function
        const fetchBook = async () => {

            const url = `http://localhost:8081/api/books/${bookId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong while fetching the book.');
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

    }, []);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8081/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
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
    }, [isReviewLeft]);

    // Handle loading state
    if (isLoading || isLoadingReview) {
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
                        // currentLoansCount={currentLoansCount} 
                        // isAuthenticated={authState?.isAuthenticated} 
                        // isCheckedOut={isCheckedOut} 
                        // checkoutBook={checkoutBook} 
                        // isReviewLeft={isReviewLeft} 
                        // submitReview={submitReview}
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
                    // currentLoansCount={currentLoansCount} 
                    // isAuthenticated={authState?.isAuthenticated} 
                    // isCheckedOut={isCheckedOut} 
                    // checkoutBook={checkoutBook} 
                    // isReviewLeft={isReviewLeft} 
                    // submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}

export default BookCheckoutPage;
