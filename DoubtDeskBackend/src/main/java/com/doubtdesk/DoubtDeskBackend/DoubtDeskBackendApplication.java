package com.doubtdesk.DoubtDeskBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.doubtdesk.DoubtDeskBackend.entity.Course;
import com.doubtdesk.DoubtDeskBackend.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;

import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.Arrays;



@SpringBootApplication
public class DoubtDeskBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoubtDeskBackendApplication.class, args);
	}
	@Bean
	CommandLineRunner initDatabase(CourseRepository courseRepository) {
		return args -> {
			Course course1 = new Course();
			course1.setCategory("Engineering");
			course1.setTitle("Engineering + Biology Admission Program 2025");
			course1.setPrice(new BigDecimal("2000.00"));
			course1.setDuration("1 Year");
			Course course2 = new Course();
			course2.setCategory("SSC");
			course2.setTitle("SSC Full Course (Science Group)");
			course2.setPrice(new BigDecimal("1000.00"));
			course2.setDuration("1 Year");

			Course course3 = new Course();
			course3.setCategory("HSC");
			course3.setTitle("HSC 1st Year (Prime Batch)");
			course3.setPrice(new BigDecimal("1500.00"));
			course3.setDuration("1 Year");
			if (courseRepository.count() == 0) {
				courseRepository.saveAll(Arrays.asList(course1, course2, course3));
				System.out.println("Database has been seeded with initial courses.");
			}
		};
	}
}
