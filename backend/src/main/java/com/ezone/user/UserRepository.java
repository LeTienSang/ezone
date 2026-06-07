package com.ezone.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByRole(User.Role role, Pageable pageable);

    long countByRoleAndCreatedAtAfter(User.Role role, LocalDateTime createdAt);

    @Query(value = "SELECT DATE(u.created_at) as d, COUNT(*) as c FROM USERS u WHERE u.created_at >= :start GROUP BY DATE(u.created_at) ORDER BY d", nativeQuery = true)
    List<Object[]> countNewUsersGroupedByDate(@Param("start") LocalDateTime start);
}