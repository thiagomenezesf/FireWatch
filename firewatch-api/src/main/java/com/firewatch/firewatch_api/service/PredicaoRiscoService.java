package com.firewatch.firewatch_api.service;

import com.firewatch.firewatch_api.dto.PredicaoRiscoDTO;
import com.firewatch.firewatch_api.model.LeituraSensor;
import com.firewatch.firewatch_api.model.PredicaoRisco;
import com.firewatch.firewatch_api.repository.LeituraSensorRepository;
import com.firewatch.firewatch_api.repository.PredicaoRiscoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PredicaoRiscoService {

    private final PredicaoRiscoRepository predicaoRiscoRepository;
    private final LeituraSensorRepository leituraSensorRepository;

    public PredicaoRiscoService(
            PredicaoRiscoRepository predicaoRiscoRepository,
            LeituraSensorRepository leituraSensorRepository
    ) {
        this.predicaoRiscoRepository = predicaoRiscoRepository;
        this.leituraSensorRepository = leituraSensorRepository;
    }

    public PredicaoRisco salvar(PredicaoRiscoDTO dto) {

        LeituraSensor leitura = leituraSensorRepository
                .findById(dto.getLeituraId())
                .orElseThrow(() ->
                        new RuntimeException("Leitura não encontrada.")
                );

        PredicaoRisco predicao = new PredicaoRisco();

        predicao.setLeitura(leitura);
        predicao.setSensorId(dto.getSensorId());
        predicao.setRisco(dto.getRisco());
        predicao.setDataHora(LocalDateTime.now());

        return predicaoRiscoRepository.save(predicao);
    }

    public List<PredicaoRisco> listarTodas() {
        return predicaoRiscoRepository.findAll();
    }
}