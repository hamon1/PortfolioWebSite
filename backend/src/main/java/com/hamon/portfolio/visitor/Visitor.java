package com.hamon.portfolio.visitor;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "visitors")
@CompoundIndex(name = "uk_ip_path_date", def = "{'ip': 1, 'path': 1, 'visitDate': 1}", unique = true)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    private String id;

    private String ip;

    private VisitPath path;

    private LocalDate visitDate;
}
