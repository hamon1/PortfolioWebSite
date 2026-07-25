package com.hamon.portfolio.visitor;

import com.hamon.portfolio.visitor.dto.VisitorStatsResponse;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final MongoTemplate mongoTemplate;

    public void record(String ip, VisitPath path) {
        if (!visitorRepository.existsByIpAndPathAndVisitDate(ip, path, LocalDate.now())) {
            visitorRepository.save(
                    Visitor.builder()
                            .ip(ip)
                            .path(path)
                            .visitDate(LocalDate.now())
                            .build()
            );
        }
    }

    public VisitorStatsResponse getStats() {
        long total = mongoTemplate
                .findDistinct("ip", Visitor.class, String.class)
                .size();

        long today = mongoTemplate
                .findDistinct(
                        Query.query(Criteria.where("visitDate").is(LocalDate.now())),
                        "ip", Visitor.class, String.class)
                .size();

        Map<String, Long> byPath = new HashMap<>();
        for (VisitPath vp : VisitPath.values()) {
            byPath.put(vp.name(), 0L);
        }

        mongoTemplate
                .aggregate(
                        Aggregation.newAggregation(
                                Aggregation.group("path").count().as("count")),
                        "visitors",
                        Document.class)
                .getMappedResults()
                .forEach(doc -> byPath.put(
                        doc.getString("_id"),
                        ((Number) doc.get("count")).longValue()));

        return new VisitorStatsResponse(total, today, byPath);
    }
}
