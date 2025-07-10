package com.libbooks.server.service;

import com.libbooks.server.entity.Book;
import com.libbooks.server.entity.Checkout;
import com.libbooks.server.repository.BookRepository;
import com.libbooks.server.repository.CheckoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
//    private HistoryRepository historyRepository;
//    private PaymentRepository paymentRepository;

    public BookService(
            BookRepository bookRepository,
            CheckoutRepository checkoutRepository)
//            HistoryRepository historyRepository,
//            PaymentRepository paymentRepository)
    {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
//        this.historyRepository = historyRepository;
//        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook (String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

//        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//
//        boolean bookNeedsReturned = false;
//
//        for (Checkout checkout: currentBooksCheckedOut) {
//            Date d1 = sdf.parse(checkout.getReturnDate());
//            Date d2 = sdf.parse(LocalDate.now().toString());
//
//            TimeUnit time = TimeUnit.DAYS;
//
//            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);
//
//            if (differenceInTime < 0) {
//                bookNeedsReturned = true;
//                break;
//            }
//        }
//
//        Payment userPayment = paymentRepository.findByUserEmail(userEmail);
//
//        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
//            throw new Exception("Outstanding fees");
//        }
//
//        if (userPayment == null) {
//            Payment payment = new Payment();
//            payment.setAmount(00.00);
//            payment.setUserEmail(userEmail);
//            paymentRepository.save(payment);
//        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

//    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
//
//        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
//
//        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
//        List<Long> bookIdList = new ArrayList<>();
//
//        for (Checkout i: checkoutList) {
//            bookIdList.add(i.getBookId());
//        }
//
//        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//
//        for (Book book : books) {
//            Optional<Checkout> checkout = checkoutList.stream()
//                    .filter(x -> x.getBookId() == book.getId()).findFirst();
//
//            if (checkout.isPresent()) {
//
//                Date d1 = sdf.parse(checkout.get().getReturnDate());
//                Date d2 = sdf.parse(LocalDate.now().toString());
//
//                TimeUnit time = TimeUnit.DAYS;
//
//                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(),
//                        TimeUnit.MILLISECONDS);
//
//                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
//            }
//        }
//        return shelfCurrentLoansResponses;
//    }
}
