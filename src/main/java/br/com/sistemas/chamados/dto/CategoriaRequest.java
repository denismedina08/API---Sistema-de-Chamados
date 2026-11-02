package br.com.sistemas.chamados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
    @NotBlank(message = "Nome é obrigatorio")
    @Size(max = 100, message = "Nome deve ter no maximo 100 caracteres")
    String nome,

    @Size(max = 255, message = "Descricao deve ter no maximo 255 caracteres")
    String descricao
) {}