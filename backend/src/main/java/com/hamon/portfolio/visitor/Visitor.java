package com.hamon.portfolio.visitor;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "visitors",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_visitor_ip_path_date",
                columnNames = {"ip", "path", "visit_date"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    private String ip;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VisitPath path;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;
}
