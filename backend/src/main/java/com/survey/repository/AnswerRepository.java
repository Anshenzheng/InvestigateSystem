package com.survey.repository;

import com.survey.entity.Answer;
import com.survey.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByResponse(Response response);
    
    @Query("SELECT a.option.id, COUNT(a) FROM Answer a WHERE a.question.id = :questionId GROUP BY a.option.id")
    List<Object[]> countAnswersByQuestionId(@Param("questionId") Long questionId);
}
