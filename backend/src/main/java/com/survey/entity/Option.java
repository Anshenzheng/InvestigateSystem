package com.survey.entity;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "options")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(name = "option_text", nullable = false, length = 500)
    private String optionText;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}
