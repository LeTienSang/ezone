package com.ezone.classroom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {
    @Query("SELECT c FROM ClassEntity c JOIN c.students s WHERE s.username = :username")
    List<ClassEntity> findClassesForStudent(@Param("username") String username);

    @Query("SELECT c FROM ClassEntity c WHERE c.instructor.user.username = :username")
    List<ClassEntity> findClassesForTeacher(@Param("username") String username);

    long countByStatus(ClassStatus status);
}
