package com.libbooks.server.controller;

import com.libbooks.server.entity.Book;
import com.libbooks.server.response.ShelfCurrentLoansResponse;
import com.libbooks.server.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("httpss://localhost:5173")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans() throws Exception { // @RequestHeader(value = "Authorization") String token
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount() { //@RequestHeader(value = "Authorization") String token
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser( @RequestParam Long bookId) { //@RequestHeader(value = "Authorization") String token,
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook (@RequestParam Long bookId) throws Exception { // @RequestHeader(value = "Authorization") String token,
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.checkoutBook(userEmail, bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestParam Long bookId) throws Exception { // @RequestHeader(value = "Authorization") String token,
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestParam Long bookId) throws Exception { // @RequestHeader(value = "Authorization") String token,
        // String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        bookService.renewLoan(userEmail, bookId);
    }

}