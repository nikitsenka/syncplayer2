package com.syncplayer.api.service;

import com.syncplayer.api.model.HelloMessage;
import com.syncplayer.api.repository.HelloMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HelloMessageService {

    private final HelloMessageRepository repository;

    @Autowired
    public HelloMessageService(HelloMessageRepository repository) {
        this.repository = repository;
    }

    public HelloMessage getHelloMessage() {
        return repository.findAll().stream()
                .findFirst()
                .orElse(new HelloMessage("Default hello message"));
    }
}