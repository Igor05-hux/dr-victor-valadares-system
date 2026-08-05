package br.com.victorvaladares.clinic.patient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PatientResponse(
    UUID id,
    String name,
    String email,
    String phone,
    LocalDate birthDate,
    String cpf,
    String rg,
    String address,
    String notes,
    String guardianName,
    String guardianCpf,
    String guardianRg,
    String lastAppointment,
    LocalDate nextAppointment,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}