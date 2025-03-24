package com.syncplayer2;

import com.syncplayer2.controller.TestMessageController;
import com.syncplayer2.model.TestMessage;
import com.syncplayer2.repository.TestMessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class TestMessageControllerTest {

    @Autowired
    private TestMessageController controller;

    @MockBean
    private TestMessageRepository repository;

    @Test
    public void testGetMessage() {
        TestMessage testMessage = new TestMessage("Test Message");
        when(repository.findAll()).thenReturn(java.util.Collections.emptyList());
        when(repository.save(testMessage)).thenReturn(testMessage);

        TestMessage result = controller.getTestMessage();
        assertEquals("Hello from SyncPlayer2!", result.getMessage());
    }
} 