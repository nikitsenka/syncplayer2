package com.syncplayer.api.controller;

import com.syncplayer.api.model.HelloMessage;
import com.syncplayer.api.service.HelloMessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HelloController.class)
public class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HelloMessageService helloMessageService;

    @Test
    public void testGetHello() throws Exception {
        // Given
        HelloMessage message = new HelloMessage(1, "Test message from DB");
        when(helloMessageService.getHelloMessage()).thenReturn(message);

        // When/Then
        mockMvc.perform(get("/api/hello"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Test message from DB"));
    }
}