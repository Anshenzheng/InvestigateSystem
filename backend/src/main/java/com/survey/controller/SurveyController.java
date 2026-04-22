package com.survey.controller;

import com.survey.dto.SurveyDTO;
import com.survey.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @GetMapping("/my")
    public ResponseEntity<?> getMySurveys(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            List<SurveyDTO> surveys = surveyService.getMySurveys(userDetails.getUsername());
            return ResponseEntity.ok(surveys);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSurvey(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            SurveyDTO survey = surveyService.getSurveyById(id);
            
            if (userDetails == null && !survey.getIsPublished()) {
                return ResponseEntity.status(401).body("Not authorized to view this survey");
            }
            
            if (userDetails != null) {
                return ResponseEntity.ok(survey);
            } else if (survey.getIsPublished()) {
                return ResponseEntity.ok(survey);
            }
            
            return ResponseEntity.status(404).body("Survey not found");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createSurvey(@Valid @RequestBody SurveyDTO surveyDTO,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            SurveyDTO createdSurvey = surveyService.createSurvey(surveyDTO, userDetails.getUsername());
            return ResponseEntity.ok(createdSurvey);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSurvey(@PathVariable Long id,
                                           @Valid @RequestBody SurveyDTO surveyDTO,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            SurveyDTO updatedSurvey = surveyService.updateSurvey(id, surveyDTO, userDetails.getUsername());
            return ResponseEntity.ok(updatedSurvey);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            surveyService.deleteSurvey(id, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishSurvey(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            SurveyDTO publishedSurvey = surveyService.publishSurvey(id, userDetails.getUsername());
            return ResponseEntity.ok(publishedSurvey);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishSurvey(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        try {
            SurveyDTO unpublishedSurvey = surveyService.unpublishSurvey(id, userDetails.getUsername());
            return ResponseEntity.ok(unpublishedSurvey);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
