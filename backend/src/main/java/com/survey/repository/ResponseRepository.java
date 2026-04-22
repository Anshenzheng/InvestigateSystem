package com.survey.repository;

import com.survey.entity.Response;
import com.survey.entity.Survey;
import com.survey.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findBySurvey(Survey survey);
    List<Response> findByUser(User user);
    long countBySurvey(Survey survey);
    Optional<Response> findBySurveyAndUser(Survey survey, User user);
    boolean existsBySurveyAndUser(Survey survey, User user);
    
    @Query("SELECT r FROM Response r LEFT JOIN FETCH r.answers a LEFT JOIN FETCH a.option WHERE r.survey.id = :surveyId")
    List<Response> findBySurveyIdWithAnswers(@Param("surveyId") Long surveyId);
}
