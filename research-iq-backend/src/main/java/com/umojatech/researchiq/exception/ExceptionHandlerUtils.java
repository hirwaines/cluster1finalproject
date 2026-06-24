package com.umojatech.researchiq.exception;

import org.springframework.web.context.request.WebRequest;

public final class ExceptionHandlerUtils {
    private ExceptionHandlerUtils() {
    }

    public static boolean isDuplicateKey(Exception ex) {
      String msg = getFullCauseMessage(ex);
      return msg.contains("duplicate key") || msg.contains("unique constraint") || msg.contains("unique_");
    }

    public static boolean isForeignKeyViolation(Exception ex) {
      String msg = getFullCauseMessage(ex);
      return msg.contains("foreign key") || msg.contains("violates foreign key constraint")
              || msg.contains("is still referenced") || msg.contains("is not present in table");
    }

    public static boolean isNotNullViolation(Exception ex) {
      String msg = getFullCauseMessage(ex);
      return msg.contains("not-null") || msg.contains("null value in column");
    }

    public static String getFullCauseMessage(Throwable ex) {
      StringBuilder sb = new StringBuilder();
      Throwable current = ex;
      while (current != null) {
        if (current.getMessage() != null) {
          sb.append(current.getMessage().toLowerCase()).append(" | ");
        }
        current = current.getCause();
      }
      return sb.toString();
    }

    public static String extractConstraintMessage(String fullMessage) {
      if (fullMessage == null) return "Data integrity violation";
      int detailIdx = fullMessage.indexOf("Detail:");
      if (detailIdx != -1) {
        String detail = fullMessage.substring(detailIdx + 7).trim();
        int endIdx = detail.indexOf('\n');
        return endIdx > 0 ? detail.substring(0, endIdx).trim() : detail.trim();
      }
      int errorIdx = fullMessage.indexOf("ERROR:");
      if (errorIdx != -1) {
        String error = fullMessage.substring(errorIdx + 6).trim();
        int endIdx = error.indexOf('\n');
        return endIdx > 0 ? error.substring(0, endIdx).trim() : error.trim();
      }
      return getFirstLine(fullMessage);
    }

    public static String extractPath(WebRequest request) {
      String path = request.getDescription(false);
      return path.startsWith("uri=") ? path.substring(4) : path;
    }

    public static String getFirstLine(String errorMessage) {
      if (errorMessage == null || errorMessage.isEmpty()) {
        return errorMessage;
      }
      int newlineIndex = errorMessage.indexOf('\n');
      int semiColonIndex = errorMessage.indexOf(';');
      int indexToUse;
      if (newlineIndex == -1 && semiColonIndex == -1) {
        return errorMessage;
      } else if (newlineIndex == -1) {
        indexToUse = semiColonIndex;
      } else if (semiColonIndex == -1) {
        indexToUse = newlineIndex;
      } else {
        indexToUse = Math.min(newlineIndex, semiColonIndex);
      }
      return errorMessage.substring(0, indexToUse);
    }
}
