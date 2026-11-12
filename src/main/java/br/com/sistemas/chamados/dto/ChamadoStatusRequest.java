package br.com.sistemas.chamados.dto;

import jakarta.validation.constraints.NotBlank;

public record ChamadoStatusRequest(
    @NotBlank(message = "Status é obrigatório")
    String status
) {}