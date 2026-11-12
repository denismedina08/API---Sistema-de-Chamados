package br.com.sistemas.chamados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChamadoRequest(
    @NotBlank(message = "Título é obrigatório")
    @Size(max = 150)
    String titulo,

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 5000)
    String descricao,

    @NotBlank(message = "Prioridade é obrigatória")
    String prioridade,

    @NotNull(message = "Cliente é obrigatório")
    Long clienteId,

    @NotNull(message = "Categoria é obrigatória")
    Long categoriaId,

    Long tecnicoId
) {}