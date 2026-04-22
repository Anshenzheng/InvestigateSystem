package com.survey.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class OptionDTO {
    private Long id;
    
    @NotBlank(message = "Option text is required")
    @Size(max = 500, message = "Option text must be less than 500 characters")
    private String optionText;
    
    private Integer orderIndex;
}
