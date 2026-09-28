package com.firewatch.firewatch_api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predicoes_risco")
public class PredicaoRisco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "leitura_id", nullable = false)
    private LeituraSensor leitura;

    @Column(name = "sensor_id", nullable = false)
    private String sensorId;

    @Column(nullable = false)
    private Double risco;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    public PredicaoRisco() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeituraSensor getLeitura() {
        return leitura;
    }

    public void setLeitura(LeituraSensor leitura) {
        this.leitura = leitura;
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

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}