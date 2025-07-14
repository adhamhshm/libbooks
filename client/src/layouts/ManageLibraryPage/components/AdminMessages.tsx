import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import type MessageModel from "../../../models/MessageModel";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import AdminMessageRequestModel from "../../../models/AdminMessageRequestModel";
import Pagination from "../../Utils/Pagination";
import AdminMessage from "./AdminMessage";


const AdminMessages = () => {
    // const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            // if (isAuthenticated) {
            //     const accessToken = await getAccessTokenSilently();
            //     const url = `${import.meta.env.VITE_REACT_API_APP}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
            //     const requestOptions = {
            //         method: 'GET',
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //             'Content-Type': 'application/json'
            //         }
            //     };
            //     const messagesResponse = await fetch(url, requestOptions);
            //     if (!messagesResponse.ok) {
            //         throw new Error('Something went wrong!');
            //     }
            //     const messagesResponseJson = await messagesResponse.json();

            //     setMessages(messagesResponseJson._embedded.messages);
            //     setTotalPages(messagesResponseJson.page.totalPages);
            // }

            const url = `${import.meta.env.VITE_REACT_API_APP}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const messagesResponse = await fetch(url, requestOptions);
            if (!messagesResponse.ok) {
                throw new Error('Something went wrong. Unable to fetch closed messages.');
            }
            const messagesResponseJson = await messagesResponse.json();

            setMessages(messagesResponseJson._embedded.messages);
            setTotalPages(messagesResponseJson.page.totalPages);
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, btnSubmit]); // isAuthenticated, getAccessTokenSilently, 

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${import.meta.env.VITE_REACT_API_APP}/messages/secure/admin/message`;
        // const accessToken = await getAccessTokenSilently();
        if (id !== null && response !== '') { // isAuthenticated &&
            const messageAdminRequestModel: AdminMessageRequestModel = new AdminMessageRequestModel(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}

export default AdminMessages;
