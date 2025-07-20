package com.libbooks.server.service;

import com.libbooks.server.entity.Book;
import com.libbooks.server.entity.Checkout;
import com.libbooks.server.entity.History;
import com.libbooks.server.entity.Payment;
import com.libbooks.server.repository.BookRepository;
import com.libbooks.server.repository.CheckoutRepository;
import com.libbooks.server.repository.HistoryRepository;
import com.libbooks.server.repository.PaymentRepository;
import com.libbooks.server.response.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;
    private PaymentRepository paymentRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook (String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        // Check for outstanding fees
        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);
        // Define a date formatter to parse date strings
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // Flag to indicate if any book is overdue
        boolean bookNeedsReturned = false;

        // Loop through each book checked out by the user
        for (Checkout checkout : currentBooksCheckedOut) {
            // Parse the return date of the book (from database)
            Date d1 = sdf.parse(checkout.getReturnDate());
            // Get the current date and parse it
            Date d2 = sdf.parse(LocalDate.now().toString());
            // Calculate the difference between return date and today's date in days
            TimeUnit time = TimeUnit.DAYS;
            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

            // If the return date has passed (i.e., the book is overdue)
            if (differenceInTime < 0) {
                bookNeedsReturned = true;
                break; // Exit the loop early as we found at least one overdue book
            }
        }

        // Retrieve the user's payment record
        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        // Check if the user has any outstanding payment or an overdue book
        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
            throw new Exception("Outstanding fees"); // Block further actions until fees are resolved
        }

        // If no payment record exists for the user, create one with 0.00 amount
        if (userPayment == null) {
            Payment payment = new Payment();
            payment.setAmount(00.00); // Set initial amount to zero
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment); // Save the new payment record in the database
        }

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

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for (Checkout i: checkoutList) {
            bookIdList.add(i.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {

        // Attempt to retrieve the book from the database by its ID
        Optional<Book> book = bookRepository.findById(bookId);

        // Attempt to retrieve the checkout record for the given user and book
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        // If the book does not exist or is not checked out by the user, throw an exception
        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        // Increase the available copies count by 1 as the book is being returned
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        // Save the updated book record
        bookRepository.save(book.get());

        // Format to parse return date string in "yyyy-MM-dd" format
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // Parse the return date from the checkout record
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        // Parse today's date
        Date d2 = sdf.parse(LocalDate.now().toString());
        // Use TimeUnit to convert milliseconds to days
        TimeUnit time = TimeUnit.DAYS;
        // Calculate the difference between the return date and today's date
        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        // If the book is returned late (i.e., return date is before today)
        if (differenceInTime < 0) {
            // Get the user's payment record
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            // Add a late fee: the absolute number of days overdue added to existing amount
            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment); // Save updated payment info
        }

        // Delete the checkout record as the book has been returned
        checkoutRepository.deleteById(validateCheckout.getId());

        // Create a history record to keep track of this return transaction
        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(), // When the book was checked out
                LocalDate.now().toString(), // When it was returned
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );

        // Save the history record
        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
