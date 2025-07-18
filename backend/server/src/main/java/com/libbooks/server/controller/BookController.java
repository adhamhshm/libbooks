package com.libbooks.server.controller;

import com.libbooks.server.entity.Book;
import com.libbooks.server.response.ShelfCurrentLoansResponse;
import com.libbooks.server.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import java.util.List;

@CrossOrigin("https://localhost:5173")
@RestController
@RequestMapping("/api/books")
public class BookController {

//    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@AuthenticationPrincipal Jwt jwt) throws Exception {
        String userEmail = jwt.getClaim("email");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("email");
        // logger.info("Get current loans count for: {}", userEmail);
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@AuthenticationPrincipal Jwt jwt, @RequestParam Long bookId) {
        String userEmail = jwt.getClaim("email");
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook (@AuthenticationPrincipal Jwt jwt, @RequestParam Long bookId) throws Exception {
        String userEmail = jwt.getClaim("email");
        return bookService.checkoutBook(userEmail, bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@AuthenticationPrincipal Jwt jwt, @RequestParam Long bookId) throws Exception {
        String userEmail = jwt.getClaim("email");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@AuthenticationPrincipal Jwt jwt, @RequestParam Long bookId) throws Exception {
        String userEmail = jwt.getClaim("email");
        bookService.renewLoan(userEmail, bookId);
    }
}