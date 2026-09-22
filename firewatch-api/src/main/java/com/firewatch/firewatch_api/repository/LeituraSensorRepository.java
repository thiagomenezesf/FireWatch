package com.firewatch.firewatch_api.repository;

import com.firewatch.firewatch_api.model.LeituraSensor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeituraSensorRepository
        extends JpaRepository<LeituraSensor, Long> {
}