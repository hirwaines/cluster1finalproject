package com.umojatech.researchiq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ResearchiqApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResearchiqApplication.class, args);
	}

}
