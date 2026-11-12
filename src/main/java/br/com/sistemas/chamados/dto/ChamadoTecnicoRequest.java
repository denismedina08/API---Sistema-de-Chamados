package br.com.sistemas.chamados.dto;

import jakarta.validation.constraints.NotNull;

public record ChamadoTecnicoRequest(
    @NotNull(message = "Técnico é obrigatório")
    Long tecnicoId
) {}