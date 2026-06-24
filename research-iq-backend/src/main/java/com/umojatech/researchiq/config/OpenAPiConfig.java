package com.umojatech.researchiq.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "ReasearchIQ Backend APIs",
                version = "v1",
                description = "API documentation ResearchIQ",
                contact = @io.swagger.v3.oas.annotations.info.Contact(
                        name = "Ange Buhendwa",
                        email = "ange.25864@auca.ac.rw"),
                license = @License(name = "Proprietary", url = "https://www.auca.ac.rw/")
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenAPiConfig {

}
