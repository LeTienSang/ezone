package com.ezone.common.util;

import com.ezone.attendance.Attendance;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AttendanceStatusConverter implements AttributeConverter<Attendance.Status, String> {
    @Override
    public String convertToDatabaseColumn(Attendance.Status status) {
        if (status == null) {
            return null;
        }
        return status.name().toLowerCase();
    }

    @Override
    public Attendance.Status convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Attendance.Status.valueOf(dbData.toUpperCase());
    }
}
