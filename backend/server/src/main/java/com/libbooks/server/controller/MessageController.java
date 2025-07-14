package com.libbooks.server.controller;

import com.libbooks.server.entity.Message;
import com.libbooks.server.request.AdminQuestionRequest;
import com.libbooks.server.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestBody Message messageRequest) { // @AuthenticationPrincipal Jwt jwt,
        // String userEmail = jwt.getClaim("email");
        String userEmail = "hehe@hehe.com";
        messageService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception { // @AuthenticationPrincipal Jwt jwt,
        // String userEmail = jwt.getClaim("email");
        String userEmail = "admin@hehe.com";
        // List<String> roles = jwt.getClaimAsStringList("https://luv2code-react-library.com/roles");
        // String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
//        if (admin == null || !admin.equals("admin")) {
//            throw new Exception("Administration page only.");
//        }
        messageService.putMessage(adminQuestionRequest, userEmail);
    }
}
