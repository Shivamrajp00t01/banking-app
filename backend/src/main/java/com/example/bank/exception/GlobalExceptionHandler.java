// package com.example.bank.exception;

// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//     @ExceptionHandler(RuntimeException.class)
//     public ResponseEntity<String> handle(RuntimeException ex) {
//         return ResponseEntity
//                 .status(HttpStatus.BAD_REQUEST)
//                 .body(ex.getMessage());
//     }
// }




package com.example.bank.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Validation failed");
        response.put("errors", errors.toString());
        
        return ResponseEntity.badRequest().body(response);
    }

    // Handle InvalidInputException
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<Map<String, String>> handleInvalidInput(
            InvalidInputException ex) {
        
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(
            Exception ex) {
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "An error occurred: " + ex.getMessage());
        
        ex.printStackTrace(); // Log the error
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
