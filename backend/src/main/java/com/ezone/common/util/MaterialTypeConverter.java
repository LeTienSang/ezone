package com.ezone.common.util;

import com.ezone.material.Material;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MaterialTypeConverter implements AttributeConverter<Material.MaterialType, String> {
    @Override
    public String convertToDatabaseColumn(Material.MaterialType type) {
        if (type == null) {
            return null;
        }
        return type.name().toLowerCase();
    }

    @Override
    public Material.MaterialType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Material.MaterialType.valueOf(dbData.toUpperCase());
    }
}
