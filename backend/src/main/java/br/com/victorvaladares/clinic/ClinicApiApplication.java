package br.com.victorvaladares.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClinicApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(
            ClinicApiApplication.class,
            args
        );
    }
}