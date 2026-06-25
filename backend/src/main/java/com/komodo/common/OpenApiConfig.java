package com.komodo.common;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI komodoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Komodo API")
                        .version("v1")
                        .description("B2C e-commerce API"));
    }
}