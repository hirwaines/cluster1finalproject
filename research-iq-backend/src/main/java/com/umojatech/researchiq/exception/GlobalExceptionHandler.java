package com.umojatech.researchiq.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handles input/validation errors, custom application exceptions, and the generic catch-all.
 * <p>
 * Spring Data JPA / Hibernate exceptions are handled by {@link DataJpaExceptionHandler}.
 * Shared helpers live in {@link ExceptionHandlerUtils}.
 */
@ControllerAdvice
@Order(2)
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  // ==================== SECURITY EXCEPTIONS ====================

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.getReasonPhrase(),
            "You do not have permission to perform this action",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Access denied for request {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
    String message = (ex instanceof org.springframework.security.authentication.LockedException
            || ex instanceof org.springframework.security.authentication.DisabledException)
            ? ex.getMessage()
            : "Authentication failed";
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            HttpStatus.UNAUTHORIZED.getReasonPhrase(),
            message,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Authentication failed for request {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  // ==================== INPUT / SERIALIZATION ERRORS ====================

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, WebRequest request) {
    String userMessage = extractCauseMessage(ex);
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            userMessage,
            ExceptionHandlerUtils.extractPath(request),
            null
    );
    logger.error("JSON parsing error for request {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
    Map<String, String> errors = new HashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Invalid input data",
            ExceptionHandlerUtils.extractPath(request),
            errors
    );
    logger.warn("Validation error for request {}: {}", ExceptionHandlerUtils.extractPath(request), errors);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
    Map<String, String> errors = ex.getConstraintViolations().stream()
            .collect(Collectors.toMap(
                    v -> v.getPropertyPath().toString(),
                    ConstraintViolation::getMessage,
                    (a, b) -> a
            ));
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Validation failed",
            ExceptionHandlerUtils.extractPath(request),
            errors
    );
    logger.warn("Constraint violation for request {}: {}", ExceptionHandlerUtils.extractPath(request), errors);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Missing required parameter: " + ex.getParameterName(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Missing request parameter: {}", ex.getParameterName());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
    String expectedType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Parameter '" + ex.getName() + "' should be of type " + expectedType,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Type mismatch for parameter '{}': expected {}", ex.getName(), expectedType);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // ==================== CUSTOM APPLICATION EXCEPTIONS ====================

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Resource not found: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(DuplicateResourceException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateResource(DuplicateResourceException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Duplicate resource: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusinessExceptions(BusinessException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Business exception: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Validation exception: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ErrorResponse> handleConflictException(ConflictException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Conflict exception: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            HttpStatus.UNAUTHORIZED.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Unauthorized: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }


  // ==================== GENERAL JAVA EXCEPTIONS ====================

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentExceptions(IllegalArgumentException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Illegal argument: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Illegal state: {}", ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  // ==================== GENERIC CATCH-ALL ====================

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalExceptions(Exception ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "An unexpected error occurred",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Unexpected error for request {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // ==================== PRIVATE HELPERS ====================

  private String extractCauseMessage(HttpMessageNotReadableException ex) {
    if (ex.getCause() instanceof JsonMappingException cause) {
      String message = cause.getOriginalMessage();
      if (message != null) {
        if (message.contains("java.time.Year")) {
          return "Invalid year format. Expected a valid year (e.g., '2024').";
        }
        return message;
      }
    }
    return "Unable to parse request body. Please check the JSON format.";
  }
}