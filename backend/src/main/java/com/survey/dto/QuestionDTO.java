package com.survey.dto;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    
    @NotBlank(message = "Question text is required")
    @Size(max = 1000, message = "Question text must be less than 1000 characters")
    private String questionText;
    
    @NotNull(message = "Question type is required")
    private String questionType;
    
    private Integer orderIndex;
    private Boolean isRequired = true;
    
    @Valid
    @Size(min = 2, message = "Question must have at least two options")
    private List<OptionDTO> options;
}
