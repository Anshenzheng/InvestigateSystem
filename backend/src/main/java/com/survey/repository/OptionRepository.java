package com.survey.repository;

import com.survey.entity.Option;
import com.survey.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestionOrderByOrderIndex(Question question);
    void deleteByQuestion(Question question);
}
