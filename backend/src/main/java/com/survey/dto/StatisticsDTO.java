package com.survey.dto;

import lombok.Data;
import java.util.List;

@Data
public class StatisticsDTO {
    private Long surveyId;
    private String surveyTitle;
    private Long totalResponses;
    private List<QuestionStatistics> questions;
    
    @Data
    public static class QuestionStatistics {
        private Long questionId;
        private String questionText;
        private String questionType;
        private List<OptionStatistics> options;
    }
    
    @Data
    public static class OptionStatistics {
        private Long optionId;
        private String optionText;
        private Long count;
        private Double percentage;
    }
}
