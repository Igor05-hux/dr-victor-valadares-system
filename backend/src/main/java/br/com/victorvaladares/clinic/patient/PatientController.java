package br.com.victorvaladares.clinic.patient;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    private final PatientService service;

    public PatientController(
        PatientService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<PatientResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PatientResponse findById(
        @PathVariable UUID id
    ) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse create(
        @Valid @RequestBody PatientRequest request
    ) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PatientResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody PatientRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @PathVariable UUID id
    ) {
        service.delete(id);
    }
}