package br.com.victorvaladares.clinic.appointment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository
    extends JpaRepository<Appointment, UUID> {

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findAllByOrderByDateAscTimeAsc();

    @Override
    @EntityGraph(attributePaths = "patient")
    Optional<Appointment> findById(UUID id);

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByDateOrderByTimeAsc(
        LocalDate date
    );

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByPatientIdOrderByDateAscTimeAsc(
        UUID patientId
    );

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByDateBetweenOrderByDateAscTimeAsc(
        LocalDate startDate,
        LocalDate endDate
    );

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByProfessionalIgnoreCaseAndDate(
        String professional,
        LocalDate date
    );
}