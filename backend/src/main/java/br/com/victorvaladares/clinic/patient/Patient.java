package br.com.victorvaladares.clinic.patient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(length = 14)
    private String cpf;

    @Column(length = 20)
    private String rg;

    @Column(length = 250)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 150)
    private String guardianName;

    @Column(length = 14)
    private String guardianCpf;

    @Column(length = 20)
    private String guardianRg;

    @Column(nullable = false, length = 30)
    private String lastAppointment;

    private LocalDate nextAppointment;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Patient() {
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null || status.isBlank()) {
            status = "Ativo";
        }

        if (
            lastAppointment == null ||
            lastAppointment.isBlank()
        ) {
            lastAppointment = "Nenhuma";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(
        String guardianName
    ) {
        this.guardianName = guardianName;
    }

    public String getGuardianCpf() {
        return guardianCpf;
    }

    public void setGuardianCpf(
        String guardianCpf
    ) {
        this.guardianCpf = guardianCpf;
    }

    public String getGuardianRg() {
        return guardianRg;
    }

    public void setGuardianRg(
        String guardianRg
    ) {
        this.guardianRg = guardianRg;
    }

    public String getLastAppointment() {
        return lastAppointment;
    }

    public void setLastAppointment(
        String lastAppointment
    ) {
        this.lastAppointment = lastAppointment;
    }

    public LocalDate getNextAppointment() {
        return nextAppointment;
    }

    public void setNextAppointment(
        LocalDate nextAppointment
    ) {
        this.nextAppointment = nextAppointment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}