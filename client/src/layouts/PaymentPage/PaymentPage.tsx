import { useAuth0 } from "@auth0/auth0-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";
import SpinnerLoading from "../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

const PaymentPage = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (isAuthenticated) {
                const url = `${import.meta.env.VITE_REACT_API_APP}/payments/search/findByUserEmail?userEmail=${user?.email}`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const paymentResponse = await fetch(url, requestOptions);
                if (!paymentResponse.ok) {
                    throw new Error('Something went wrong. Unable to fetch fees.')
                }
                const paymentResponseJson = await paymentResponse.json();
                setFees(paymentResponseJson.amount);
                setLoadingFees(false);
            }
        }

        fetchFees().catch((error: any) => {
            setLoadingFees(false);
            setHttpError(error.message);
        })
    }, [isAuthenticated, user?.email]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        const accessToken = await getAccessTokenSilently();
        const paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), 'MYR', accessToken);

        const url = `${import.meta.env.VITE_REACT_API_APP}/payment/secure/payment-intent`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        };

        const stripeResponse = await fetch(url, requestOptions);

        if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong. Unable to create payment.');
        }

        const stripeResponseJson = await stripeResponse.json();

        stripe.confirmCardPayment(
            stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: user?.email
                    }
                }
            }, {handleActions: false}
        ).then(async function (result: any) {
            if (result.error) {
                setSubmitDisabled(false)
                alert('There was an error')
            } 
            else {
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_REACT_API_APP}/payment/secure/payment-complete`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const stripeResponse = await fetch(url, requestOptions);
                if (!stripeResponse.ok) {
                    setHttpError(true)
                    setSubmitDisabled(false)
                    throw new Error('Something went wrong. Unable to complete payment.');
                }
                setFees(0);
                setSubmitDisabled(false);
            }
        });
        setHttpError(false);
    }

    if (loadingFees) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }


    return(
        <div className='container'>
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element' />
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3' 
                        onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}

            {fees === 0 && 
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link type='button' className='btn main-color text-white' to='search'>
                        Explore top books
                    </Link>
                </div>
            }
            {submitDisabled && <SpinnerLoading/>}
        </div>
    );
}
export default PaymentPage;