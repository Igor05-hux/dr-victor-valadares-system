package br.com.victorvaladares.clinic.patient;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PatientService {

    private final PatientRepository repository;

    public PatientService(
        PatientRepository repository
    ) {
        this.repository = repository;
    }

    public List<PatientResponse> findAll() {
        return repository
            .findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public PatientResponse findById(UUID id) {
        return toResponse(findEntityById(id));
    }

    public PatientResponse create(
        PatientRequest request
    ) {
        validateUniqueFields(request, null);

        Patient patient = new Patient();

        copyRequestToEntity(request, patient);

        if (
            patient.getStatus() == null ||
            patient.getStatus().isBlank()
        ) {
            patient.setStatus("Ativo");
        }

        if (
            patient.getLastAppointment() == null ||
            patient.getLastAppointment().isBlank()
        ) {
            patient.setLastAppointment("Nenhuma");
        }

        return toResponse(repository.save(patient));
    }

    public PatientResponse update(
        UUID id,
        PatientRequest request
    ) {
        Patient patient = findEntityById(id);

        validateUniqueFields(request, id);
        copyRequestToEntity(request, patient);

        return toResponse(repository.save(patient));
    }

    public void delete(UUID id) {
        Patient patient = findEntityById(id);
        repository.delete(patient);
    }

    private Patient findEntityById(UUID id) {
        return repository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Paciente não encontrado."
                )
            );
    }

    private void validateUniqueFields(
        PatientRequest request,
        UUID currentPatientId
    ) {
        repository
            .findAll()
            .stream()
            .filter(
                patient ->
                    currentPatientId == null ||
                    !patient.getId().equals(
                        currentPatientId
                    )
            )
            .forEach(patient -> {
                if (
                    patient
                        .getEmail()
                        .equalsIgnoreCase(
                            request.email().trim()
                        )
                ) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Já existe um paciente com este e-mail."
                    );
                }

                if (
                    request.cpf() != null &&
                    !request.cpf().isBlank() &&
                    request.cpf().equals(
                        patient.getCpf()
                    )
                ) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Já existe um paciente com este CPF."
                    );
                }
            });
    }

    private void copyRequestToEntity(
        PatientRequest request,
        Patient patient
    ) {
        patient.setName(request.name().trim());
        patient.setEmail(request.email().trim());
        patient.setPhone(request.phone().trim());
        patient.setBirthDate(request.birthDate());

        patient.setCpf(cleanOptional(request.cpf()));
        patient.setRg(cleanOptional(request.rg()));
        patient.setAddress(
            cleanOptional(request.address())
        );
        patient.setNotes(
            cleanOptional(request.notes())
        );

        patient.setGuardianName(
            cleanOptional(request.guardianName())
        );
        patient.setGuardianCpf(
            cleanOptional(request.guardianCpf())
        );
        patient.setGuardianRg(
            cleanOptional(request.guardianRg())
        );

        patient.setLastAppointment(
            request.lastAppointment() == null ||
            request.lastAppointment().isBlank()
                ? "Nenhuma"
                : request.lastAppointment().trim()
        );

        patient.setNextAppointment(
            request.nextAppointment()
        );

        patient.setStatus(
            request.status() == null ||
            request.status().isBlank()
                ? "Ativo"
                : request.status().trim()
        );
    }

    private String cleanOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private PatientResponse toResponse(
        Patient patient
    ) {
        return new PatientResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getPhone(),
            patient.getBirthDate(),
            patient.getCpf(),
            patient.getRg(),
            patient.getAddress(),
            patient.getNotes(),
            patient.getGuardianName(),
            patient.getGuardianCpf(),
            patient.getGuardianRg(),
            patient.getLastAppointment(),
            patient.getNextAppointment(),
            patient.getStatus(),
            patient.getCreatedAt(),
            patient.getUpdatedAt()
        );
    }
}