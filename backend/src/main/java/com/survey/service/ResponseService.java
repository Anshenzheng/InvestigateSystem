package com.survey.service;

import com.survey.dto.AnswerDTO;
import com.survey.dto.ResponseDTO;
import com.survey.entity.*;
import com.survey.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Transactional
    public ResponseDTO submitResponse(ResponseDTO responseDTO, String username) {
        Survey survey = surveyRepository.findById(responseDTO.getSurveyId())
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        if (!survey.getIsPublished()) {
            throw new RuntimeException("Survey is not published");
        }

        User user = null;
        if (username != null && !username.isEmpty()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        if (!survey.getIsAnonymous() && user == null) {
            throw new RuntimeException("You must be logged in to complete this survey");
        }

        if (user != null && responseRepository.existsBySurveyAndUser(survey, user)) {
            throw new RuntimeException("You have already submitted a response for this survey");
        }

        validateAnswers(survey, responseDTO.getAnswers());

        Response response = new Response();
        response.setSurvey(survey);
        response.setUser(user);

        List<Answer> answers = new ArrayList<>();
        for (AnswerDTO answerDTO : responseDTO.getAnswers()) {
            Question question = questionRepository.findById(answerDTO.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            if (question.getQuestionType() == Question.QuestionType.SINGLE_CHOICE) {
                if (answerDTO.getOptionId() != null) {
                    Option option = optionRepository.findById(answerDTO.getOptionId())
                            .orElseThrow(() -> new RuntimeException("Option not found"));
                    Answer answer = new Answer();
                    answer.setResponse(response);
                    answer.setQuestion(question);
                    answer.setOption(option);
                    answers.add(answer);
                }
            } else if (question.getQuestionType() == Question.QuestionType.MULTIPLE_CHOICE) {
                if (answerDTO.getOptionIds() != null && !answerDTO.getOptionIds().isEmpty()) {
                    for (Long optionId : answerDTO.getOptionIds()) {
                        Option option = optionRepository.findById(optionId)
                                .orElseThrow(() -> new RuntimeException("Option not found"));
                        Answer answer = new Answer();
                        answer.setResponse(response);
                        answer.setQuestion(question);
                        answer.setOption(option);
                        answers.add(answer);
                    }
                }
            }
        }

        response.setAnswers(answers);
        Response savedResponse = responseRepository.save(response);
        return convertToDTO(savedResponse);
    }

    private void validateAnswers(Survey survey, List<AnswerDTO> answers) {
        List<Question> requiredQuestions = survey.getQuestions().stream()
                .filter(Question::getIsRequired)
                .collect(Collectors.toList());

        for (Question question : requiredQuestions) {
            boolean answered = answers.stream()
                    .anyMatch(a -> {
                        if (!a.getQuestionId().equals(question.getId())) {
                            return false;
                        }
                        if (question.getQuestionType() == Question.QuestionType.SINGLE_CHOICE) {
                            return a.getOptionId() != null;
                        } else {
                            return a.getOptionIds() != null && !a.getOptionIds().isEmpty();
                        }
                    });
            
            if (!answered) {
                throw new RuntimeException("Question '" + question.getQuestionText() + "' is required");
            }
        }
    }

    public List<ResponseDTO> getSurveyResponses(Long surveyId, String username) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!survey.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to view these responses");
        }

        List<Response> responses = responseRepository.findBySurveyIdWithAnswers(surveyId);
        return responses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ResponseDTO getResponseById(Long id) {
        Response response = responseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Response not found"));
        return convertToDTO(response);
    }

    private ResponseDTO convertToDTO(Response response) {
        ResponseDTO dto = new ResponseDTO();
        dto.setId(response.getId());
        dto.setSurveyId(response.getSurvey().getId());
        if (response.getUser() != null) {
            dto.setUserId(response.getUser().getId());
        }
        dto.setSubmittedAt(response.getSubmittedAt());

        if (response.getAnswers() != null) {
            List<AnswerDTO> answerDTOs = new ArrayList<>();
            response.getAnswers().stream()
                    .collect(Collectors.groupingBy(Answer::getQuestion))
                    .forEach((question, answers) -> {
                        AnswerDTO answerDTO = new AnswerDTO();
                        answerDTO.setQuestionId(question.getId());
                        
                        if (question.getQuestionType() == Question.QuestionType.SINGLE_CHOICE) {
                            if (!answers.isEmpty()) {
                                answerDTO.setOptionId(answers.get(0).getOption().getId());
                            }
                        } else {
                            List<Long> optionIds = answers.stream()
                                    .map(a -> a.getOption().getId())
                                    .collect(Collectors.toList());
                            answerDTO.setOptionIds(optionIds);
                        }
                        answerDTOs.add(answerDTO);
                    });
            dto.setAnswers(answerDTOs);
        }

        return dto;
    }
}
