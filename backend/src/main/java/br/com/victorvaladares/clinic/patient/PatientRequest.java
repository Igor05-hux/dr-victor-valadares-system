package br.com.victorvaladares.clinic.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public record PatientRequest(
    @NotBlank(message = "O nome é obrigatório.")
    String name,

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    String email,

    @NotBlank(message = "O telefone é obrigatório.")
    String phone,

    @NotNull(message = "A data de nascimento é obrigatória.")
    @Past(message = "A data de nascimento deve estar no passado.")
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
    String status
) {
}