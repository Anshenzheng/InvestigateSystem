package com.survey.service;

import com.survey.dto.StatisticsDTO;
import com.survey.entity.*;
import com.survey.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class StatisticsService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public StatisticsDTO getSurveyStatistics(Long surveyId, String username) {
        Survey survey = surveyRepository.findByIdWithQuestions(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        if (survey.getQuestions() != null) {
            for (Question question : survey.getQuestions()) {
                question.getOptions().size();
            }
        }

        if (username != null && !username.isEmpty()) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && !survey.getCreator().getId().equals(user.getId())) {
                if (!survey.getIsPublished()) {
                    throw new RuntimeException("Survey is not published");
                }
            }
        } else {
            if (!survey.getIsPublished()) {
                throw new RuntimeException("Survey is not published");
            }
        }

        long totalResponses = responseRepository.countBySurvey(survey);

        StatisticsDTO statistics = new StatisticsDTO();
        statistics.setSurveyId(survey.getId());
        statistics.setSurveyTitle(survey.getTitle());
        statistics.setTotalResponses(totalResponses);

        List<StatisticsDTO.QuestionStatistics> questionStatsList = new ArrayList<>();

        for (Question question : survey.getQuestions()) {
            StatisticsDTO.QuestionStatistics questionStats = new StatisticsDTO.QuestionStatistics();
            questionStats.setQuestionId(question.getId());
            questionStats.setQuestionText(question.getQuestionText());
            questionStats.setQuestionType(question.getQuestionType().name());

            List<StatisticsDTO.OptionStatistics> optionStatsList = new ArrayList<>();
            long questionTotal = 0;

            Map<Long, Long> optionCountMap = new HashMap<>();
            List<Object[]> counts = answerRepository.countAnswersByQuestionId(question.getId());
            for (Object[] count : counts) {
                Long optionId = (Long) count[0];
                Long cnt = (Long) count[1];
                optionCountMap.put(optionId, cnt);
                questionTotal += cnt;
            }

            for (Option option : question.getOptions()) {
                StatisticsDTO.OptionStatistics optionStats = new StatisticsDTO.OptionStatistics();
                optionStats.setOptionId(option.getId());
                optionStats.setOptionText(option.getOptionText());
                
                Long count = optionCountMap.getOrDefault(option.getId(), 0L);
                optionStats.setCount(count);
                
                if (questionTotal > 0) {
                    optionStats.setPercentage(Math.round((count.doubleValue() / questionTotal) * 10000.0) / 100.0);
                } else {
                    optionStats.setPercentage(0.0);
                }
                
                optionStatsList.add(optionStats);
            }

            questionStats.setOptions(optionStatsList);
            questionStatsList.add(questionStats);
        }

        statistics.setQuestions(questionStatsList);
        return statistics;
    }
}
