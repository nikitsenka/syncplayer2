package com.syncplayer.api.repository;

import com.syncplayer.api.model.HelloMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelloMessageRepository extends JpaRepository<HelloMessage, Long> {
}