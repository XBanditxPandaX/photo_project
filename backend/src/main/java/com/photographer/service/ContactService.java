package com.photographer.service;

import com.photographer.model.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final JavaMailSender mailSender;
    private final String toAddress;
    private final String fromAddress;

    public ContactService(
            JavaMailSender mailSender,
            @Value("${contact.mail.to}") String toAddress,
            @Value("${contact.mail.from}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
    }

    public void sendContactMail(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toAddress);
        message.setFrom(fromAddress);
        message.setReplyTo(request.email());
        message.setSubject("Nouveau message de contact - " + request.firstName() + " " + request.lastName());
        message.setText(buildBody(request));

        mailSender.send(message);
    }

    private String buildBody(ContactRequest request) {
        return "Un nouveau message a ete envoye depuis le formulaire de contact.\n\n"
                + "Prenom: " + request.firstName() + "\n"
                + "Nom: " + request.lastName() + "\n"
                + "Email: " + request.email() + "\n\n"
                + "Message:\n" + request.message();
    }
}