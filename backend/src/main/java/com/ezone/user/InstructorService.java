package com.ezone.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class InstructorService {
    private final InstructorRepository instructorRepository;

    public InstructorService(InstructorRepository instructorRepository) {
        this.instructorRepository = instructorRepository;
    }

    @Transactional(readOnly = true)
    public List<InstructorResponse> getAllInstructors() {
        log.info("Fetching list of all instructors");
        List<Instructor> list = instructorRepository.findAll();
        return list.stream()
                .map(InstructorResponse::fromEntity)
                .toList();
    }
}
