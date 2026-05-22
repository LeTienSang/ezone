package com.ezone.common.util;

import com.ezone.payment.Payment;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PaymentStatusConverter implements AttributeConverter<Payment.Status, String> {
    @Override
    public String convertToDatabaseColumn(Payment.Status status) {
        if (status == null) {
            return null;
        }
        return status.name().toLowerCase();
    }

    @Override
    public Payment.Status convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Payment.Status.valueOf(dbData.toUpperCase());
    }
}
