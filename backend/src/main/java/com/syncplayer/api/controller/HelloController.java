package com.syncplayer.api.controller;

import com.syncplayer.api.model.HelloMessage;
import com.syncplayer.api.service.HelloMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    private final HelloMessageService helloMessageService;

    @Autowired
    public HelloController(HelloMessageService helloMessageService) {
        this.helloMessageService = helloMessageService;
    }

    @GetMapping("/hello")
    public Map<String, String> getHello() {
        HelloMessage message = helloMessageService.getHelloMessage();
        Map<String, String> response = new HashMap<>();
        response.put("message", message.getMessage());
        return response;
    }
}