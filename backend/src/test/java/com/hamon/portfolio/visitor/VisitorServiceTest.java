package com.hamon.portfolio.visitor;

import com.hamon.portfolio.visitor.dto.VisitorStatsResponse;
import org.bson.Document;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisitorServiceTest {

    @Mock
    VisitorRepository visitorRepository;

    @Mock
    MongoTemplate mongoTemplate;

    @InjectMocks
    VisitorService visitorService;

    @Test
    @DisplayName("새로운 방문자는 저장됨")
    void record_newVisitor_saves() {
        when(visitorRepository.existsByIpAndPathAndVisitDate("1.2.3.4", VisitPath.HOME, LocalDate.now()))
                .thenReturn(false);

        visitorService.record("1.2.3.4", VisitPath.HOME);

        verify(visitorRepository).save(any(Visitor.class));
    }

    @Test
    @DisplayName("같은 날 중복 방문자는 저장 생략")
    void record_duplicateVisitor_skips() {
        when(visitorRepository.existsByIpAndPathAndVisitDate("1.2.3.4", VisitPath.HOME, LocalDate.now()))
                .thenReturn(true);

        visitorService.record("1.2.3.4", VisitPath.HOME);

        verify(visitorRepository, never()).save(any());
    }

    @Test
    @DisplayName("방문자 통계 반환")
    void getStats_returnsAggregatedCounts() {
        when(mongoTemplate.findDistinct(eq("ip"), eq(Visitor.class), eq(String.class)))
                .thenReturn(List.of("1.2.3.4", "5.6.7.8"));
        when(mongoTemplate.findDistinct(any(Query.class), eq("ip"), eq(Visitor.class), eq(String.class)))
                .thenReturn(List.of("1.2.3.4"));

        @SuppressWarnings("unchecked")
        AggregationResults<Document> results = mock(AggregationResults.class);
        Document homeDoc = new Document("_id", "HOME").append("count", 2);
        when(results.getMappedResults()).thenReturn(List.of(homeDoc));
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("visitors"), eq(Document.class)))
                .thenReturn(results);

        VisitorStatsResponse stats = visitorService.getStats();

        assertThat(stats.total()).isEqualTo(2L);
        assertThat(stats.today()).isEqualTo(1L);
        assertThat(stats.byPath().get("HOME")).isEqualTo(2L);
        assertThat(stats.byPath().get("BLOG")).isEqualTo(0L);
    }
}
