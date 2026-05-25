package com.ezone.config;

import org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class UpperCaseTableNamingStrategy extends CamelCaseToUnderscoresNamingStrategy {
    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        Identifier identifier = super.toPhysicalTableName(name, jdbcEnvironment);
        if (identifier == null) {
            return null;
        }
        return Identifier.toIdentifier(identifier.getText().toUpperCase(), identifier.isQuoted());
    }
}
