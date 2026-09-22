package com.firewatch.firewatch_api.controller;

import com.firewatch.firewatch_api.model.LeituraSensor;
import com.firewatch.firewatch_api.service.LeituraSensorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firewatch.firewatch_api.dto.LeituraSensorDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/leituras")
public class LeituraSensorController {

    private final LeituraSensorService leituraSensorService;

    public LeituraSensorController(LeituraSensorService leituraSensorService) {
        this.leituraSensorService = leituraSensorService;
    }

    @PostMapping
    public ResponseEntity<LeituraSensor> salvar(
            @Valid @RequestBody LeituraSensorDTO dto) {

        LeituraSensor leituraSalva = leituraSensorService.salvar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(leituraSalva);
    }

    @GetMapping
    public ResponseEntity<List<LeituraSensor>> listarTodas() {

        List<LeituraSensor> leituras = leituraSensorService.listarTodas();

        return ResponseEntity.ok(leituras);
    }
}