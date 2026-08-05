package br.com.victorvaladares.clinic.appointment;

import br.com.victorvaladares.clinic.patient.Patient;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @UuidGenerator private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    @Column(nullable = false, length = 150) private String procedure;
    @Column(nullable = false, length = 150) private String professional;
    @Column(nullable = false) private LocalDate date;
    @Column(nullable = false) private LocalTime time;
    @Column(nullable = false) private Integer duration;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20) private AppointmentStatus status;
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(nullable = false) private LocalDateTime updatedAt;
    public Appointment() {}
    @PrePersist public void prePersist(){ var now=LocalDateTime.now(); createdAt=now; updatedAt=now; if(status==null) status=AppointmentStatus.PENDENTE; }
    @PreUpdate public void preUpdate(){ updatedAt=LocalDateTime.now(); }
    public UUID getId(){return id;}
    public Patient getPatient(){return patient;} public void setPatient(Patient patient){this.patient=patient;}
    public String getProcedure(){return procedure;} public void setProcedure(String procedure){this.procedure=procedure;}
    public String getProfessional(){return professional;} public void setProfessional(String professional){this.professional=professional;}
    public LocalDate getDate(){return date;} public void setDate(LocalDate date){this.date=date;}
    public LocalTime getTime(){return time;} public void setTime(LocalTime time){this.time=time;}
    public Integer getDuration(){return duration;} public void setDuration(Integer duration){this.duration=duration;}
    public AppointmentStatus getStatus(){return status;} public void setStatus(AppointmentStatus status){this.status=status;}
    public String getNotes(){return notes;} public void setNotes(String notes){this.notes=notes;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
