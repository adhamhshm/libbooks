package com.libbooks.server.controller;

import com.libbooks.server.entity.Book;
import com.libbooks.server.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:5173")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

//    @GetMapping("/secure/currentloans")
//    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token)
//            throws Exception
//    {
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
//        return bookService.currentLoans(userEmail);
//    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount() { //@RequestHeader(value = "Authorization") String token
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser( @RequestParam Long bookId) { //@RequestHeader(value = "Authorization") String token,
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook (@RequestParam Long bookId) throws Exception { // @RequestHeader(value = "Authorization") String token,
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userEmail = "hehe@hehe.com";
        return bookService.checkoutBook(userEmail, bookId);
    }

//    @PutMapping("/secure/return")
//    public void returnBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
//        bookService.returnBook(userEmail, bookId);
//    }
//
//    @PutMapping("/secure/renew/loan")
//    public void renewLoan(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
//        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
//        bookService.renewLoan(userEmail, bookId);
//    }

}