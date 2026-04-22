package com.survey.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class AnswerDTO {
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    private Long optionId;
    private List<Long> optionIds;
}
