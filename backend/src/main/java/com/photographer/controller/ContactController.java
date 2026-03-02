package com.photographer.controller;

import com.photographer.model.ContactRequest;
import com.photographer.service.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContact(@RequestBody ContactRequest request) {
        if (isBlank(request.firstName()) || isBlank(request.lastName()) || isBlank(request.email()) || isBlank(request.message())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tous les champs sont obligatoires."));
        }

        try {
            contactService.sendContactMail(request);
            return ResponseEntity.ok(Map.of("message", "Message envoye avec succes."));
        } catch (MailException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Impossible d'envoyer le message pour le moment."));
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
