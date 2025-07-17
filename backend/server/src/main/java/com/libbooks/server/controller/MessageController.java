package com.libbooks.server.controller;

import com.libbooks.server.entity.Message;
import com.libbooks.server.request.AdminQuestionRequest;
import com.libbooks.server.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:5173")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Value("${okta.oauth2.groupsClaim}")
    private String groupsClaim;

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@AuthenticationPrincipal Jwt jwt, @RequestBody Message messageRequest) {
        String userEmail = jwt.getClaim("email");
        messageService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@AuthenticationPrincipal Jwt jwt,@RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = jwt.getClaim("email");
        List<String> roles = jwt.getClaimAsStringList(groupsClaim);
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only.");
        }
        messageService.putMessage(adminQuestionRequest, userEmail);
    }
}
