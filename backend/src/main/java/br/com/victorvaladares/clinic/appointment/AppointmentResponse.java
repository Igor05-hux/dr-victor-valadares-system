package br.com.victorvaladares.clinic.appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
    UUID id,
    UUID patientId,
    String patient,
    String procedure,
    String professional,
    LocalDate date,
    LocalTime time,
    Integer duration,
    AppointmentStatus status,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
