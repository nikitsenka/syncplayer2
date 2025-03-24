package com.syncplayer2.controller;

import com.syncplayer2.model.TestMessage;
import com.syncplayer2.repository.TestMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestMessageController {

    @Autowired
    private TestMessageRepository testMessageRepository;

    @GetMapping("/message")
    public TestMessage getTestMessage() {
        return testMessageRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> testMessageRepository.save(new TestMessage("Hello from SyncPlayer2!")));
    }
} 