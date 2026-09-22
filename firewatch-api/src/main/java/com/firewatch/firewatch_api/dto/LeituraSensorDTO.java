package com.firewatch.firewatch_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LeituraSensorDTO {

    @NotBlank(message = "O identificador do sensor é obrigatório.")
    private String sensorId;

    @NotNull(message = "A temperatura é obrigatória.")
    @Min(value = -40, message = "A temperatura mínima permitida é -40°C.")
    @Max(value = 80, message = "A temperatura máxima permitida é 80°C.")
    private Double temperatura;

    @NotNull(message = "A umidade é obrigatória.")
    @Min(value = 0, message = "A umidade não pode ser menor que 0%.")
    @Max(value = 100, message = "A umidade não pode ser maior que 100%.")
    private Double umidade;

    public LeituraSensorDTO() {
    }

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }

    public Double getUmidade() {
        return umidade;
    }

    public void setUmidade(Double umidade) {
        this.umidade = umidade;
    }
}