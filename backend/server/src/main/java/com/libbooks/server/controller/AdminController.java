package com.libbooks.server.controller;

import com.libbooks.server.request.AddBookRequest;
import com.libbooks.server.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestParam Long bookId) throws Exception { // @AuthenticationPrincipal Jwt jwt,
//        List<String> roles = jwt.getClaimAsStringList("https://luv2code-react-library.com/roles");
//        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
//
//        if (admin == null || !admin.equals("admin")) {
//            throw new Exception("Administration page only");
//        }
        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestParam Long bookId) throws Exception { // @AuthenticationPrincipal Jwt jwt,
//        List<String> roles = jwt.getClaimAsStringList("https://luv2code-react-library.com/roles");
//        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
//
//        if (admin == null || !admin.equals("admin")) {
//            throw new Exception("Administration page only");
//        }
        adminService.decreaseBookQuantity(bookId);
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestBody AddBookRequest addBookRequest) throws Exception { // @AuthenticationPrincipal Jwt jwt,
//        List<String> roles = jwt.getClaimAsStringList("https://luv2code-react-library.com/roles");
//        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
//
//        if (admin == null || !admin.equals("admin")) {
//            throw new Exception("Administration page only");
//        }
        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestParam Long bookId) throws Exception { // @AuthenticationPrincipal Jwt jwt,
//        List<String> roles = jwt.getClaimAsStringList("https://luv2code-react-library.com/roles");
//        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
//
//        if (admin == null || !admin.equals("admin")) {
//            throw new Exception("Administration page only");
//        }
        adminService.deleteBook(bookId);
    }

}
