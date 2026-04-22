package com.survey.controller;

import com.survey.dto.SurveyDTO;
import com.survey.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/surveys/public")
public class PublicSurveyController {

    @Autowired
    private SurveyService surveyService;

    @GetMapping
    public ResponseEntity<?> getAllPublishedSurveys() {
        try {
            List<SurveyDTO> surveys = surveyService.getAllPublishedSurveys();
            return ResponseEntity.ok(surveys);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPublishedSurvey(@PathVariable Long id) {
        try {
            SurveyDTO survey = surveyService.getPublishedSurveyById(id);
            return ResponseEntity.ok(survey);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
