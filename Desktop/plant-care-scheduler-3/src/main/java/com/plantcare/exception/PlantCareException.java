package com.plantcare.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PlantCareException extends RuntimeException {
    public PlantCareException(String message) {
        super(message);
    }
}
