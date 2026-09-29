package com.firewatch.firewatch_api.controller;

import com.firewatch.firewatch_api.dto.PredicaoRiscoDTO;
import com.firewatch.firewatch_api.model.PredicaoRisco;
import com.firewatch.firewatch_api.service.PredicaoRiscoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predicoes")
@CrossOrigin(origins = "http://localhost:5173")
public class PredicaoRiscoController {

    private final PredicaoRiscoService predicaoRiscoService;

    public PredicaoRiscoController(PredicaoRiscoService predicaoRiscoService) {
        this.predicaoRiscoService = predicaoRiscoService;
    }

    @PostMapping
    public ResponseEntity<PredicaoRisco> salvar(
            @Valid @RequestBody PredicaoRiscoDTO dto
    ) {
        PredicaoRisco predicao = predicaoRiscoService.salvar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(predicao);
    }

    @GetMapping
    public ResponseEntity<List<PredicaoRisco>> listarTodas() {
        return ResponseEntity.ok(
                predicaoRiscoService.listarTodas()
        );
    }
}