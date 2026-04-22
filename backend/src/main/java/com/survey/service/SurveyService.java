package com.survey.service;

import com.survey.dto.OptionDTO;
import com.survey.dto.QuestionDTO;
import com.survey.dto.SurveyDTO;
import com.survey.entity.Option;
import com.survey.entity.Question;
import com.survey.entity.Survey;
import com.survey.entity.User;
import com.survey.repository.ResponseRepository;
import com.survey.repository.SurveyRepository;
import com.survey.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Transactional
    public SurveyDTO createSurvey(SurveyDTO surveyDTO, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Survey survey = convertToEntity(surveyDTO, creator);
        Survey savedSurvey = surveyRepository.save(survey);
        return convertToDTO(savedSurvey);
    }

    @Transactional
    public SurveyDTO updateSurvey(Long id, SurveyDTO surveyDTO, String username) {
        Survey existingSurvey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existingSurvey.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this survey");
        }

        if (existingSurvey.getIsPublished()) {
            throw new RuntimeException("Cannot modify a published survey");
        }

        existingSurvey.setTitle(surveyDTO.getTitle());
        existingSurvey.setDescription(surveyDTO.getDescription());
        existingSurvey.setIsAnonymous(surveyDTO.getIsAnonymous());

        existingSurvey.getQuestions().clear();
        if (surveyDTO.getQuestions() != null) {
            for (int i = 0; i < surveyDTO.getQuestions().size(); i++) {
                QuestionDTO questionDTO = surveyDTO.getQuestions().get(i);
                Question question = convertQuestionToEntity(questionDTO, existingSurvey);
                question.setOrderIndex(i);
                existingSurvey.getQuestions().add(question);
            }
        }

        Survey savedSurvey = surveyRepository.save(existingSurvey);
        return convertToDTO(savedSurvey);
    }

    @Transactional
    public void deleteSurvey(Long id, String username) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!survey.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this survey");
        }

        surveyRepository.delete(survey);
    }

    @Transactional
    public SurveyDTO publishSurvey(Long id, String username) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!survey.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to publish this survey");
        }

        if (survey.getQuestions() == null || survey.getQuestions().isEmpty()) {
            throw new RuntimeException("Survey must have at least one question to publish");
        }

        survey.setIsPublished(true);
        survey.setPublishedAt(LocalDateTime.now());
        Survey savedSurvey = surveyRepository.save(survey);
        return convertToDTO(savedSurvey);
    }

    @Transactional
    public SurveyDTO unpublishSurvey(Long id, String username) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!survey.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to unpublish this survey");
        }

        survey.setIsPublished(false);
        survey.setPublishedAt(null);
        Survey savedSurvey = surveyRepository.save(survey);
        return convertToDTO(savedSurvey);
    }

    public SurveyDTO getSurveyById(Long id) {
        Survey survey = surveyRepository.findByIdWithQuestionsAndOptions(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        return convertToDTO(survey);
    }

    public SurveyDTO getPublishedSurveyById(Long id) {
        Survey survey = surveyRepository.findByIdWithQuestionsAndOptionsPublished(id)
                .orElseThrow(() -> new RuntimeException("Survey not found or not published"));
        return convertToDTO(survey);
    }

    public List<SurveyDTO> getMySurveys(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Survey> surveys = surveyRepository.findByCreatorOrderByCreatedAtDesc(user);
        return surveys.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<SurveyDTO> getAllPublishedSurveys() {
        List<Survey> surveys = surveyRepository.findByIsPublishedTrueOrderByPublishedAtDesc();
        return surveys.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private Survey convertToEntity(SurveyDTO dto, User creator) {
        Survey survey = new Survey();
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setCreator(creator);
        survey.setIsAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false);
        survey.setIsPublished(false);

        List<Question> questions = new ArrayList<>();
        if (dto.getQuestions() != null) {
            for (int i = 0; i < dto.getQuestions().size(); i++) {
                QuestionDTO questionDTO = dto.getQuestions().get(i);
                Question question = convertQuestionToEntity(questionDTO, survey);
                question.setOrderIndex(i);
                questions.add(question);
            }
        }
        survey.setQuestions(questions);
        return survey;
    }

    private Question convertQuestionToEntity(QuestionDTO dto, Survey survey) {
        Question question = new Question();
        question.setQuestionText(dto.getQuestionText());
        question.setQuestionType(Question.QuestionType.valueOf(dto.getQuestionType()));
        question.setOrderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : 0);
        question.setIsRequired(dto.getIsRequired() != null ? dto.getIsRequired() : true);
        question.setSurvey(survey);

        List<Option> options = new ArrayList<>();
        if (dto.getOptions() != null) {
            for (int i = 0; i < dto.getOptions().size(); i++) {
                OptionDTO optionDTO = dto.getOptions().get(i);
                Option option = new Option();
                option.setOptionText(optionDTO.getOptionText());
                option.setOrderIndex(i);
                option.setQuestion(question);
                options.add(option);
            }
        }
        question.setOptions(options);
        return question;
    }

    private SurveyDTO convertToDTO(Survey survey) {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(survey.getId());
        dto.setTitle(survey.getTitle());
        dto.setDescription(survey.getDescription());
        dto.setCreatorId(survey.getCreator().getId());
        dto.setCreatorName(survey.getCreator().getUsername());
        dto.setIsAnonymous(survey.getIsAnonymous());
        dto.setIsPublished(survey.getIsPublished());
        dto.setCreatedAt(survey.getCreatedAt());
        dto.setUpdatedAt(survey.getUpdatedAt());
        dto.setPublishedAt(survey.getPublishedAt());
        dto.setResponseCount(responseRepository.countBySurvey(survey));

        if (survey.getQuestions() != null) {
            List<QuestionDTO> questionDTOs = new ArrayList<>();
            for (Question question : survey.getQuestions()) {
                QuestionDTO questionDTO = convertQuestionToDTO(question);
                questionDTOs.add(questionDTO);
            }
            dto.setQuestions(questionDTOs);
        }

        return dto;
    }

    private QuestionDTO convertQuestionToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType().name());
        dto.setOrderIndex(question.getOrderIndex());
        dto.setIsRequired(question.getIsRequired());

        if (question.getOptions() != null) {
            List<OptionDTO> optionDTOs = new ArrayList<>();
            for (Option option : question.getOptions()) {
                OptionDTO optionDTO = new OptionDTO();
                optionDTO.setId(option.getId());
                optionDTO.setOptionText(option.getOptionText());
                optionDTO.setOrderIndex(option.getOrderIndex());
                optionDTOs.add(optionDTO);
            }
            dto.setOptions(optionDTOs);
        }

        return dto;
    }
}
