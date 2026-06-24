package com.komodo.common;

/**
 * Thrown when a requested resource does not exist in the database.
 * The GlobalExceptionHandler maps this to a 404 response.
 *
 * Usage: throw new ResourceNotFoundException("Product not found: " + id);
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}