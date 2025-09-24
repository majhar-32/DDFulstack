package com.doubtdesk.DoubtDeskBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "subject")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "subject_name", unique = true)
    private String subjectName;

    @ManyToMany(mappedBy = "subjects")
    private Set<Course> courses = new HashSet<>();

    // Question এর সাথে One-to-Many সম্পর্ক
    @OneToMany(
            mappedBy = "subject",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<Question> questions = new HashSet<>();
}