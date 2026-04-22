package com.survey.controller;

import com.survey.dto.ResponseDTO;
import com.survey.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping
    public ResponseEntity<?> submitResponse(@Valid @RequestBody ResponseDTO responseDTO,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails != null ? userDetails.getUsername() : null;
            ResponseDTO submittedResponse = responseService.submitResponse(responseDTO, username);
            return ResponseEntity.ok(submittedResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<?> getSurveyResponses(@PathVariable Long surveyId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            List<ResponseDTO> responses = responseService.getSurveyResponses(surveyId, userDetails.getUsername());
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResponse(@PathVariable Long id) {
        try {
            ResponseDTO response = responseService.getResponseById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
