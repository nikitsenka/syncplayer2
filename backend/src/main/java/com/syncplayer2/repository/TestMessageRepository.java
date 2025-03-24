package com.syncplayer2.repository;

import com.syncplayer2.model.TestMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestMessageRepository extends JpaRepository<TestMessage, Long> {
} 