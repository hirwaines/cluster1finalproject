package com.umojatech.researchiq.util;

import java.util.Arrays;
import java.util.List;


public final class CsvUtil {

    private CsvUtil() {
    }

   
    public static List<String> toList(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split("[,;\n]"))
                .map(String::trim)
                .filter(part -> !part.isBlank())
                .toList();
    }

 
    public static String toCsv(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        String joined = values.stream()
                .filter(v -> v != null && !v.isBlank())
                .map(String::trim)
                .reduce((a, b) -> a + "," + b)
                .orElse("");
        return joined.isBlank() ? null : joined;
    }
}
