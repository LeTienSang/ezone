package com.ezone.material;

import com.ezone.classroom.ClassEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @Column(nullable = false)
    private String title;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Convert(converter = com.ezone.common.util.MaterialTypeConverter.class)
    @Column(name = "material_type", nullable = false)
    private MaterialType materialType;

    public enum MaterialType {
        PDF, VIDEO, LINK, DOC
    }
}
