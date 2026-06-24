package com.umojatech.researchiq.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.security.jwt")
public class JwtProperties {
    private String secretKey;
    private long expirationMs;
    private long refreshExpirationMs;
    private String issuer;
}

