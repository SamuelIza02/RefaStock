package com.refastock.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parametro_sistema")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametroSistema {

    @Id
    @Column(name = "clave")
    private String clave;

    @Column(name = "valor", nullable = false, length = 255)
    private String valor;
}
