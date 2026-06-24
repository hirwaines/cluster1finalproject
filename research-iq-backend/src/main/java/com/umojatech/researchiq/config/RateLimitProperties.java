package com.umojatech.researchiq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.ratelimit")
public class RateLimitProperties {
    private int requestsPerMinute;
}

