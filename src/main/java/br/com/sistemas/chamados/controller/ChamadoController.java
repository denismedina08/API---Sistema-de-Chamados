package br.com.sistemas.chamados.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// * para importar todos
import br.com.sistemas.chamados.dto.*;
import br.com.sistemas.chamados.service.ChamadoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    private final ChamadoService service;

    public ChamadoController(ChamadoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChamadoResponse> criar(
        @Valid @RequestBody ChamadoRequest dto
    ) {
        ChamadoResponse criado = service.criar(dto);
        return ResponseEntity.created(
            URI.create("/chamados/" + criado.id())
        ).body(criado);
    }

    @GetMapping
    public List<ChamadoResponse> listar(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String prioridade,
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Long tecnicoId,
        @RequestParam(required = false) Long clienteId
    ) {
        return service.listar(
            status, prioridade, categoriaId, tecnicoId, clienteId
        );
    }

    @GetMapping("/{id}")
    public ChamadoResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    public ChamadoResponse atualizar(
        @PathVariable Long id,
        @Valid @RequestBody ChamadoRequest dto
    ) {
        return service.atualizar(id, dto);
    }

    @PatchMapping("/{id}/status")
    public ChamadoResponse atualizarStatus(
        @PathVariable Long id,
        @Valid @RequestBody ChamadoStatusRequest dto
    ) {
        return service.atualizarStatus(id, dto.status());
    }

    @PatchMapping("/{id}/tecnico")
    public ChamadoResponse atribuirTecnico(
        @PathVariable Long id,
        @Valid @RequestBody ChamadoTecnicoRequest dto
    ) {
        return service.atribuirTecnico(id, dto.tecnicoId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}