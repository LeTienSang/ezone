package com.ezone.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseCatalogRepository extends JpaRepository<CourseCatalog, Integer> {
    Page<CourseCatalog> findAllByIsVisibleTrue(Pageable pageable);
}