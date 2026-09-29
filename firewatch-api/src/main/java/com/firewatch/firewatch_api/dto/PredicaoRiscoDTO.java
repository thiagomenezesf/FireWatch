package com.firewatch.firewatch_api.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PredicaoRiscoDTO {

    @NotNull(message = "O ID da leitura é obrigatório.")
    private Long leituraId;

    @NotBlank(message = "O ID do sensor é obrigatório.")
    private String sensorId;

    @NotNull(message = "O risco é obrigatório.")
    @DecimalMin(value = "0.0", message = "O risco não pode ser menor que 0.")
    @DecimalMax(value = "1.0", message = "O risco não pode ser maior que 1.")
    private Double risco;

    public Long getLeituraId() {
        return leituraId;
    }

    public void setLeituraId(Long leituraId) {
        this.leituraId = leituraId;
    }

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public Double getRisco() {
        return risco;
    }

    public void setRisco(Double risco) {
        this.risco = risco;
    }
}