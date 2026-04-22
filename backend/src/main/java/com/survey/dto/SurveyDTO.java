package com.survey.dto;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyDTO {
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;
    
    private Long creatorId;
    private String creatorName;
    
    @NotNull(message = "Anonymous flag is required")
    private Boolean isAnonymous;
    
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private Long responseCount;
    
    @Valid
    @Size(min = 1, message = "Survey must have at least one question")
    private List<QuestionDTO> questions;
}
