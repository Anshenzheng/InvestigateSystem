package com.survey.repository;

import com.survey.entity.Survey;
import com.survey.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCreator(User creator);
    List<Survey> findByIsPublishedTrue();
    Optional<Survey> findByIdAndIsPublishedTrue(Long id);
    
    @Query("SELECT s FROM Survey s LEFT JOIN FETCH s.questions q LEFT JOIN FETCH q.options WHERE s.id = :id")
    Optional<Survey> findByIdWithQuestionsAndOptions(@Param("id") Long id);
    
    @Query("SELECT s FROM Survey s LEFT JOIN FETCH s.questions q LEFT JOIN FETCH q.options WHERE s.id = :id AND s.isPublished = true")
    Optional<Survey> findByIdWithQuestionsAndOptionsPublished(@Param("id") Long id);
    
    List<Survey> findByCreatorOrderByCreatedAtDesc(User creator);
    List<Survey> findByIsPublishedTrueOrderByPublishedAtDesc();
}
