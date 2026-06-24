package com.umojatech.researchiq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.bootstrap-admin")
public class BootstrapAdminProperties {
  private String email;
  private String password;
  private String name;
}