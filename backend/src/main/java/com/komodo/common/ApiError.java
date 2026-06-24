package com.komodo.common;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

/**
 * Standard error response body returned by all API endpoints on failure.
 *
 * Every error the frontend receives will have this shape:
 * {
 * "status": 404,
 * "error": "NOT_FOUND",
 * "message": "Product not found",
 * "timestamp": "2025-01-01T00:00:00Z"
 * }
 */
@Getter
@Builder
public class ApiError {

    private final int status;
    private final String error;
    private final String message;

    @Builder.Default
    private final Instant timestamp = Instant.now();
}