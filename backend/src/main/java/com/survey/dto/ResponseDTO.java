package com.survey.dto;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResponseDTO {
    private Long id;
    private Long surveyId;
    private Long userId;
    private LocalDateTime submittedAt;
    
    @Valid
    @NotNull(message = "Answers are required")
    private List<AnswerDTO> answers;
}
