package br.com.victorvaladares.clinic.appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.victorvaladares.clinic.patient.Patient;
import br.com.victorvaladares.clinic.patient.PatientRepository;

@Service
@Transactional
public class AppointmentService {
    private final AppointmentRepository repository;
    private final PatientRepository patientRepository;
    public AppointmentService(AppointmentRepository repository, PatientRepository patientRepository){ this.repository=repository; this.patientRepository=patientRepository; }
    public List<AppointmentResponse> findAll(){ return repository.findAllByOrderByDateAscTimeAsc().stream().map(this::toResponse).toList(); }
    public AppointmentResponse findById(UUID id){ return toResponse(findEntityById(id)); }
    public List<AppointmentResponse> findByDate(LocalDate date){ return repository.findByDateOrderByTimeAsc(date).stream().map(this::toResponse).toList(); }
    public List<AppointmentResponse> findByPatientId(UUID patientId){ return repository.findByPatientIdOrderByDateAscTimeAsc(patientId).stream().map(this::toResponse).toList(); }
    public List<AppointmentResponse> findByPeriod(LocalDate startDate, LocalDate endDate){ if(endDate.isBefore(startDate)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A data final não pode ser anterior à data inicial."); return repository.findByDateBetweenOrderByDateAscTimeAsc(startDate,endDate).stream().map(this::toResponse).toList(); }
    public List<AppointmentResponse> findUpcoming(Integer limit){ var now=LocalDateTime.now(); var list=repository.findAllByOrderByDateAscTimeAsc().stream().filter(a->a.getStatus()!=AppointmentStatus.CANCELADA && a.getStatus()!=AppointmentStatus.CONCLUIDA).filter(a->!LocalDateTime.of(a.getDate(),a.getTime()).isBefore(now)).map(this::toResponse).toList(); return limit==null||limit<=0?list:list.stream().limit(limit).toList(); }
    public AppointmentResponse create(AppointmentRequest request){ var patient=findPatientById(request.patientId()); validateScheduleConflict(request,null); var a=new Appointment(); copy(request,a,patient); return toResponse(repository.save(a)); }
    public AppointmentResponse update(UUID id, AppointmentRequest request){ var a=findEntityById(id); var patient=findPatientById(request.patientId()); validateScheduleConflict(request,id); copy(request,a,patient); return toResponse(repository.save(a)); }
    public void delete(UUID id){ repository.delete(findEntityById(id)); }
    private Appointment findEntityById(UUID id){ return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Consulta não encontrada.")); }
    private Patient findPatientById(UUID id){ return patientRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Paciente não encontrado.")); }
    private void validateScheduleConflict(AppointmentRequest r, UUID ignoredId){ if(r.status()==AppointmentStatus.CANCELADA) return; var start=r.time(); var end=start.plusMinutes(r.duration()); boolean conflict=repository.findByProfessionalIgnoreCaseAndDate(r.professional().trim(),r.date()).stream().filter(a->ignoredId==null||!a.getId().equals(ignoredId)).filter(a->a.getStatus()!=AppointmentStatus.CANCELADA).anyMatch(a->{var es=a.getTime(); var ee=es.plusMinutes(a.getDuration()); return start.isBefore(ee)&&end.isAfter(es);}); if(conflict) throw new ResponseStatusException(HttpStatus.CONFLICT,"Já existe uma consulta para esse profissional no período selecionado."); }
    private void copy(AppointmentRequest r, Appointment a, Patient p){ a.setPatient(p); a.setProcedure(r.procedure().trim()); a.setProfessional(r.professional().trim()); a.setDate(r.date()); a.setTime(r.time()); a.setDuration(r.duration()); a.setStatus(r.status()); a.setNotes(r.notes()==null||r.notes().isBlank()?null:r.notes().trim()); }
    private AppointmentResponse toResponse(Appointment a){ return new AppointmentResponse(a.getId(),a.getPatient().getId(),a.getPatient().getName(),a.getProcedure(),a.getProfessional(),a.getDate(),a.getTime(),a.getDuration(),a.getStatus(),a.getNotes(),a.getCreatedAt(),a.getUpdatedAt()); }
}
