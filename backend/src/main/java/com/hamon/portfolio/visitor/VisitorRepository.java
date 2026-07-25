package com.hamon.portfolio.visitor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    boolean existsByIpAndPathAndVisitDate(String ip, VisitPath path, LocalDate visitDate);

    long countByVisitDate(LocalDate date);

    @Query("""
            SELECT v.path, COUNT(v) FROM Visitor v
            GROUP BY v.path
            """)
    List<Object[]> countGroupByPath();

    @Query("""
            SELECT COUNT(DISTINCT v.ip) FROM Visitor v
            """)
    long countDistinctIp();

    @Query("""
            SELECT COUNT(DISTINCT v.ip) FROM Visitor v
            WHERE v.visitDate = :date
            """)
    long countDistinctIpByDate(@Param("date") LocalDate date);
}
