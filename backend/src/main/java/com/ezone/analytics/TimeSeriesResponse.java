package com.ezone.analytics;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSeriesResponse {
    private List<String> labels;
    private List<BigDecimal> values;
}
