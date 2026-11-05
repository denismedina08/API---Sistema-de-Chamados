package br.com.sistemas.chamados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ComentarioRequest(
    @NotBlank(message = "Comentário é obrigatório")
    @Size(max = 5000)
    String texto,

    @NotBlank(message = "Autor é obrigatório")
    @Size(max = 120)
    String autor
) {}