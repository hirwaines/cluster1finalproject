package com.umojatech.researchiq.exception;

public class DuplicateResourceException extends RuntimeException {

  private final String resourceName;
  private final String identifier;

  public DuplicateResourceException(String resourceName, String identifier) {
    super(resourceName + " already exists with identifier: " + identifier);
    this.resourceName = resourceName;
    this.identifier = identifier;
  }

  public DuplicateResourceException(String message) {
    super(message);
    this.resourceName = null;
    this.identifier = null;
  }

  public String getResourceName() {
    return resourceName;
  }

  public String getIdentifier() {
    return identifier;
  }
}