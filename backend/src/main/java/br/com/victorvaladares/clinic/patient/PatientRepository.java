package br.com.victorvaladares.clinic.patient;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository
    extends JpaRepository<Patient, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByCpf(String cpf);
}