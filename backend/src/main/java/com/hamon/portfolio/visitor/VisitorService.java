package com.hamon.portfolio.visitor;

import com.hamon.portfolio.visitor.dto.VisitorStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VisitorService {

    private final VisitorRepository visitorRepository;

    @Transactional
    public void record(String ip, VisitPath path) {
        LocalDate today = LocalDate.now();
        boolean exists = visitorRepository.existsByIpAndPathAndVisitDate(ip, path, today);
        if (exists) {
            return;
        }
        visitorRepository.save(
                Visitor.builder()
                        .ip(ip)
                        .path(path)
                        .visitDate(today)
                        .build()
        );
    }

    public VisitorStatsResponse getStats() {
        long total = visitorRepository.countDistinctIp();
        long today = visitorRepository.countDistinctIpByDate(LocalDate.now());

        List<Object[]> rows = visitorRepository.countGroupByPath();
        Map<String, Long> byPath = new HashMap<>();
        for (VisitPath vp : VisitPath.values()) {
            byPath.put(vp.name(), 0L);
        }
        for (Object[] row : rows) {
            String pathName = ((VisitPath) row[0]).name();
            long count = (long) row[1];
            byPath.put(pathName, count);
        }

        return new VisitorStatsResponse(total, today, byPath);
    }
}
