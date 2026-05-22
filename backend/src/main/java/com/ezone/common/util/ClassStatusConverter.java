package com.ezone.common.util;

import com.ezone.classroom.ClassStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ClassStatusConverter implements AttributeConverter<ClassStatus, String> {
    @Override
    public String convertToDatabaseColumn(ClassStatus status) {
        if (status == null) {
            return null;
        }
        return status.name().toLowerCase();
    }

    @Override
    public ClassStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return ClassStatus.valueOf(dbData.toUpperCase());
    }
}
