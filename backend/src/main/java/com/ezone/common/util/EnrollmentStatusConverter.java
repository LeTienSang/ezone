package com.ezone.common.util;

import com.ezone.enrollment.Enrollment;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EnrollmentStatusConverter implements AttributeConverter<Enrollment.Status, String> {
    @Override
    public String convertToDatabaseColumn(Enrollment.Status status) {
        if (status == null) {
            return null;
        }
        return status.name().toLowerCase();
    }

    @Override
    public Enrollment.Status convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enrollment.Status.valueOf(dbData.toUpperCase());
    }
}
