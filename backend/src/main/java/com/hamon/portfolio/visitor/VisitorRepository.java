package com.hamon.portfolio.visitor;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;

public interface VisitorRepository extends MongoRepository<Visitor, String> {

    boolean existsByIpAndPathAndVisitDate(String ip, VisitPath path, LocalDate visitDate);
}
