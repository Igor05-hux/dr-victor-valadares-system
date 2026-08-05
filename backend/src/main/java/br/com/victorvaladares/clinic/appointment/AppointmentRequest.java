package br.com.victorvaladares.clinic.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentRequest(
    @NotNull(message = "Selecione um paciente.") UUID patientId,
    @NotBlank(message = "Informe o procedimento.") String procedure,
    @NotBlank(message = "Informe o profissional.") String professional,
    @NotNull(message = "Informe a data da consulta.") LocalDate date,
    @NotNull(message = "Informe o horário da consulta.") LocalTime time,
    @NotNull(message = "Informe a duração da consulta.")
    @Positive(message = "A duração deve ser maior que zero.") Integer duration,
    @NotNull(message = "Informe o status da consulta.") AppointmentStatus status,
    String notes
) {}
