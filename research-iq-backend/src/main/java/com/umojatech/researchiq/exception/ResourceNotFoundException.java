package com.umojatech.researchiq.exception;

public class ResourceNotFoundException extends RuntimeException {

  private final String resourceName;
  private final String identifier;

  public ResourceNotFoundException(String resourceName, String identifier) {
    super(resourceName + " not found with identifier: " + identifier);
    this.resourceName = resourceName;
    this.identifier = identifier;
  }

  public ResourceNotFoundException(String message) {
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
