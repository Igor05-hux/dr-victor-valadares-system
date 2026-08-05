package br.com.victorvaladares.clinic.appointment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {
    private final AppointmentService service;
    public AppointmentController(AppointmentService service){this.service=service;}
    @GetMapping public List<AppointmentResponse> findAll(){return service.findAll();}
    @GetMapping("/{id}") public AppointmentResponse findById(@PathVariable UUID id){return service.findById(id);}
    @GetMapping("/date/{date}") public List<AppointmentResponse> findByDate(@PathVariable LocalDate date){return service.findByDate(date);}
    @GetMapping("/patient/{patientId}") public List<AppointmentResponse> findByPatientId(@PathVariable UUID patientId){return service.findByPatientId(patientId);}
    @GetMapping("/period") public List<AppointmentResponse> findByPeriod(@RequestParam LocalDate startDate,@RequestParam LocalDate endDate){return service.findByPeriod(startDate,endDate);}
    @GetMapping("/upcoming") public List<AppointmentResponse> findUpcoming(@RequestParam(required=false) Integer limit){return service.findUpcoming(limit);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public AppointmentResponse create(@Valid @RequestBody AppointmentRequest request){return service.create(request);}
    @PutMapping("/{id}") public AppointmentResponse update(@PathVariable UUID id,@Valid @RequestBody AppointmentRequest request){return service.update(id,request);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id){service.delete(id);}
}
