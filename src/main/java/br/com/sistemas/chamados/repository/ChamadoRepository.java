package br.com.sistemas.chamados.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.sistemas.chamados.entity.Chamado;

public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    List<Chamado> findByStatusIgnoreCase(String status);

    List<Chamado> findByPrioridadeIgnoreCase(String prioridade);

    List<Chamado> findByCategoriaId(Long categoriaId);

    List<Chamado> findByTecnicoId(Long tecnicoId);

    List<Chamado> findByClienteId(Long clienteId);

    List<Chamado> findByStatusIgnoreCaseAndCategoriaId(
        String status, Long categoriaId
    );

    List<Chamado> findByStatusIgnoreCaseAndTecnicoId(
        String status, Long tecnicoId
    );

    List<Chamado> findByCategoriaIdAndTecnicoId(
        Long categoriaId, Long tecnicoId
    );
}