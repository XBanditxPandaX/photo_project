package com.photographer.service;

import com.photographer.model.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ContactService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;
    private final String toAddress;
    private final String fromAddress;
    private final String senderName;

    public ContactService(
            RestTemplate restTemplate,
            @Value("${brevo.api.url}") String apiUrl,
            @Value("${brevo.api.key}") String apiKey,
            @Value("${contact.mail.to}") String toAddress,
            @Value("${contact.mail.from}") String fromAddress,
            @Value("${contact.mail.sender-name}") String senderName
    ) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
        this.senderName = senderName;
    }

    public void sendContactMail(ContactRequest request) {
        validateConfiguration();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> payload = Map.of(
                "sender", Map.of("name", senderName, "email", fromAddress),
                "to", List.of(Map.of("email", toAddress)),
                "replyTo", Map.of("email", request.email()),
                "subject", "Nouveau message de contact - " + request.firstName() + " " + request.lastName(),
                "htmlContent", buildHtmlBody(request)
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IllegalStateException("Brevo API returned status " + response.getStatusCode());
            }
        } catch (RestClientException ex) {
            throw new IllegalStateException("Brevo API request failed", ex);
        }
    }

    private void validateConfiguration() {
        if (isBlank(apiKey) || isBlank(apiUrl) || isBlank(toAddress) || isBlank(fromAddress)) {
            throw new IllegalArgumentException("Brevo/contact configuration is incomplete");
        }
    }

    private String buildHtmlBody(ContactRequest request) {
        return "<h2>Nouveau message de contact</h2>"
                + "<p><strong>Prenom:</strong> " + escape(request.firstName()) + "</p>"
                + "<p><strong>Nom:</strong> " + escape(request.lastName()) + "</p>"
                + "<p><strong>Email:</strong> " + escape(request.email()) + "</p>"
                + "<p><strong>Message:</strong><br/>" + escape(request.message()).replace("\n", "<br/>") + "</p>";
    }

    private boolean isBlank(String value) {
        return Objects.isNull(value) || value.trim().isEmpty();
    }

    private String escape(String value) {
        return value == null
                ? ""
                : value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}