package com.plantcare.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EnvironmentDataException extends RuntimeException {
    public EnvironmentDataException(String message) {
        super(message);
    }
}
