package com.firewatch.firewatch_api.service;

import com.firewatch.firewatch_api.model.LeituraSensor;
import com.firewatch.firewatch_api.repository.LeituraSensorRepository;
import com.firewatch.firewatch_api.dto.LeituraSensorDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeituraSensorService {

    private final LeituraSensorRepository leituraSensorRepository;

    public LeituraSensorService(LeituraSensorRepository leituraSensorRepository) {
        this.leituraSensorRepository = leituraSensorRepository;
    }

    public LeituraSensor salvar(LeituraSensorDTO dto) {

    LeituraSensor leitura = new LeituraSensor();

    leitura.setSensorId(dto.getSensorId());
    leitura.setTemperatura(dto.getTemperatura());
    leitura.setUmidade(dto.getUmidade());
    leitura.setDataHora(LocalDateTime.now());
    leitura.setLatitude(dto.getLatitude());
    leitura.setLongitude(dto.getLongitude());
    leitura.setRegiao(dto.getRegiao());

    return leituraSensorRepository.save(leitura);
}

    public List<LeituraSensor> listarTodas() {
        return leituraSensorRepository.findAll();
    }
}