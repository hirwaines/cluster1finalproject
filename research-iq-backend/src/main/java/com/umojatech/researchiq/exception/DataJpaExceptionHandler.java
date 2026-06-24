package com.umojatech.researchiq.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

/**
 * Handles all Spring Data JPA / Hibernate exceptions.
 * Higher priority (@Order(1)) so these are matched before the generic catch-all.
 */
@ControllerAdvice
@Order(1)
public class DataJpaExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(DataJpaExceptionHandler.class);

  // Handle DataIntegrityViolationException (unique, FK, check constraints via JPA/Hibernate)
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
    HttpStatus status;
    String userMessage;

    if (ExceptionHandlerUtils.isDuplicateKey(ex)) {
      status = HttpStatus.CONFLICT;
      userMessage = "Record already exists";
    } else if (ExceptionHandlerUtils.isForeignKeyViolation(ex)) {
      status = HttpStatus.BAD_REQUEST;
      userMessage = "Referenced record does not exist or record is still referenced by other records";
    } else if (ExceptionHandlerUtils.isNotNullViolation(ex)) {
      status = HttpStatus.BAD_REQUEST;
      userMessage = "A required field is missing";
    } else {
      status = HttpStatus.BAD_REQUEST;
      userMessage = "Data integrity violation";
    }

    // Try to extract the constraint detail from PostgreSQL
    String detail = ExceptionHandlerUtils.extractConstraintMessage(ex.getMessage());
    if (!detail.equals(userMessage)) {
      userMessage = userMessage + ": " + detail;
    }

    ErrorResponse errorResponse = new ErrorResponse(
            status.value(),
            status.getReasonPhrase(),
            userMessage,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Data integrity violation for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage());
    return new ResponseEntity<>(errorResponse, status);
  }

  // Handle JPA entity not found via Spring (e.g., getById/getReferenceById on missing entity)
  @ExceptionHandler(JpaObjectRetrievalFailureException.class)
  public ResponseEntity<ErrorResponse> handleJpaObjectRetrievalFailure(JpaObjectRetrievalFailureException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            "Referenced entity not found",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("JPA entity retrieval failure: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  // Handle optimistic locking (JPA @Version conflict)
  @ExceptionHandler({OptimisticLockingFailureException.class, OptimisticLockException.class})
  public ResponseEntity<ErrorResponse> handleOptimisticLocking(Exception ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            "The record was modified by another user. Please refresh and try again",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Optimistic locking failure: {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  // Handle pessimistic locking (database lock timeout / deadlock)
  @ExceptionHandler(PessimisticLockingFailureException.class)
  public ResponseEntity<ErrorResponse> handlePessimisticLocking(PessimisticLockingFailureException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            "The record is currently locked by another operation. Please try again later",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Pessimistic locking failure: {}", ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  // Handle query timeout
  @ExceptionHandler(QueryTimeoutException.class)
  public ResponseEntity<ErrorResponse> handleQueryTimeout(QueryTimeoutException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.REQUEST_TIMEOUT.value(),
            HttpStatus.REQUEST_TIMEOUT.getReasonPhrase(),
            "The database query took too long. Please try again or narrow your search",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Query timeout for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.REQUEST_TIMEOUT);
  }

  // Handle JPA system errors (e.g., Hibernate trigger errors, stored procedure failures)
  @ExceptionHandler(JpaSystemException.class)
  public ResponseEntity<ErrorResponse> handleJpaSystemExceptions(JpaSystemException ex, WebRequest request) {
    String message = ex.getMessage() != null ? ExceptionHandlerUtils.getFirstLine(ex.getMessage()) : "JPA system error";
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            message,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("JPA System error for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  // Handle transaction failures (e.g., constraint violations during commit)
  @ExceptionHandler(TransactionSystemException.class)
  public ResponseEntity<ErrorResponse> handleTransactionException(TransactionSystemException ex, WebRequest request) {
    Throwable cause = ex.getRootCause();
    if (cause instanceof ConstraintViolationException cve) {
      // Delegate to GlobalExceptionHandler's ConstraintViolationException handler via re-throw workaround
      // Instead, handle inline here
      var errors = cve.getConstraintViolations().stream()
              .collect(java.util.stream.Collectors.toMap(
                      v -> v.getPropertyPath().toString(),
                      jakarta.validation.ConstraintViolation::getMessage,
                      (a, b) -> a
              ));
      ErrorResponse errorResponse = new ErrorResponse(
              HttpStatus.BAD_REQUEST.value(),
              HttpStatus.BAD_REQUEST.getReasonPhrase(),
              "Validation failed",
              ExceptionHandlerUtils.extractPath(request),
              errors
      );
      logger.warn("Transaction constraint violation for {}: {}", ExceptionHandlerUtils.extractPath(request), errors);
      return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    String message = cause != null ? cause.getMessage() : ex.getMessage();
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Transaction failed: " + ExceptionHandlerUtils.getFirstLine(message),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Transaction error for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle invalid JPA API usage (e.g., passing null to a non-nullable method)
  @ExceptionHandler(InvalidDataAccessApiUsageException.class)
  public ResponseEntity<ErrorResponse> handleInvalidDataAccessApiUsage(InvalidDataAccessApiUsageException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Invalid data access operation",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Invalid data access API usage: {}", ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  // Handle JPA empty result (no record found by Spring Data)
  @ExceptionHandler(EmptyResultDataAccessException.class)
  public ResponseEntity<ErrorResponse> handleEmptyResult(EmptyResultDataAccessException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            "Resource not found",
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Empty result for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  // Handle JPA PersistenceException (general JPA failures not caught above)
  @ExceptionHandler(PersistenceException.class)
  public ResponseEntity<ErrorResponse> handlePersistenceException(PersistenceException ex, WebRequest request) {
    String message = ex.getMessage() != null ? ExceptionHandlerUtils.getFirstLine(ex.getMessage()) : "Persistence error";
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            message,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("JPA persistence error for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Handle EntityNotFoundException (legacy JPA, kept for backward compatibility)
  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            ex.getMessage(),
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.warn("Entity not found (legacy): {}", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  // Handle general Spring DataAccessException (catch-all for any Spring Data issues not caught above)
  @ExceptionHandler(org.springframework.dao.DataAccessException.class)
  public ResponseEntity<ErrorResponse> handleSpringDataAccessException(org.springframework.dao.DataAccessException ex, WebRequest request) {
    String userMessage;
    HttpStatus status;

    if (ExceptionHandlerUtils.isDuplicateKey(ex)) {
      status = HttpStatus.CONFLICT;
      userMessage = "Record already exists";
    } else if (ExceptionHandlerUtils.isForeignKeyViolation(ex)) {
      status = HttpStatus.BAD_REQUEST;
      userMessage = "Referenced record does not exist or record is still referenced";
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      String detail = ex.getMessage() != null ? ExceptionHandlerUtils.getFirstLine(ex.getMessage()) : "";
      userMessage = "Database operation failed" + (detail.isEmpty() ? "" : ": " + detail);
    }

    ErrorResponse errorResponse = new ErrorResponse(
            status.value(),
            status.getReasonPhrase(),
            userMessage,
            ExceptionHandlerUtils.extractPath(request)
    );
    logger.error("Spring Data error for {}: {}", ExceptionHandlerUtils.extractPath(request), ex.getMessage(), ex);
    return new ResponseEntity<>(errorResponse, status);
  }
}